import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Donation } from '../models/Donation';
import { Need } from '../models/Need';
import { Inventory } from '../models/Inventory';
import { Reward } from '../models/Reward';
import { Enquiry } from '../models/Enquiry';
import { LuckySpinPrize, LuckySpinDraw } from '../models/LuckySpin';
import { ConfigItem, CategorySuggestion, Milestone, PointsTier, RewardClaim } from '../models/Config';
import { DonationDraft } from '../models/DonationDraft';

// Extend Request interface to hold authenticated user
interface AuthenticatedRequest extends Request {
  user?: any;
}

const fmt = (doc: any) => {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  return { ...obj, id: (doc._id || doc.id).toString() };
};

const fmtAll = (docs: any[]) => docs.map(fmt);

export function startRestServer(port: number) {
  const app = express();

  // Configure CORS
  app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Middleware for simple token authentication: extracts userId from Authorization header "Bearer token_<userId>"
  const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      if (token.startsWith('token_')) {
        const userId = token.substring(6);
        if (mongoose.Types.ObjectId.isValid(userId)) {
          const userObj = await User.findById(userId);
          if (userObj) {
            req.user = userObj;
          }
        }
      }
    }
    next();
  };

  app.use(authMiddleware);

  // Helper route to check API status
  app.get('/api/health/', (req, res) => {
    res.json({ status: 'ok', message: 'HungerFree ERP REST API is active!' });
  });

  // ─── Authentication ───
  app.post('/api/auth/login/', async (req, res) => {
    try {
      const { email, password, role } = req.body;
      const user = await User.findOne({ email, role: role ? role.toUpperCase() : 'DONOR' });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials or role mismatch' });
      }
      res.json({
        token: `token_${user._id}`,
        user: fmt(user)
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // ─── Admin Users Summary & CRUD ───
  app.get('/api/admin/users/', async (req, res) => {
    try {
      const users = await User.find({});
      // Format as expected by frontend user_store
      const formatted = users.map((u: any) => ({
        id: u._id.toString(),
        username: u.username,
        email: u.email,
        profile: {
          role: u.role,
          phone: u.phone || '',
          address: u.donorProfile?.address?.line1 || u.ngoProfile?.location || '',
          created_at: u.createdAt,
          last_login_at: u.updatedAt
        },
        donor_profile: {
          points: u.gamification?.points || 0,
          business_name: u.donorProfile?.businessName || ''
        },
        ngo_profile: {
          name: u.ngoProfile?.name || ''
        },
        volunteer_profile: {
          rating: u.volunteerProfile?.rating || 0
        }
      }));
      res.json(formatted);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/admin/donors/', async (req, res) => {
    try {
      const donors = await User.find({ role: 'DONOR' });
      const formatted = donors.map((u: any) => ({
        id: u._id.toString(),
        business_name: u.donorProfile?.businessName || u.username,
        business_type: u.donorProfile?.businessType || 'Other',
        total_donations: u.donorProfile?.profileCompleteness || 0, // Mock count or map from metadata
        points: u.gamification?.points || 0,
        status: u.isVerified ? 'Active' : 'Pending',
        contact_person: u.username,
        email: u.email,
        phone: u.phone,
        address: u.donorProfile?.address?.line1 || ''
      }));
      res.json(formatted);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.patch('/api/admin/donors/:id/', async (req, res) => {
    try {
      const { status } = req.body;
      const isVerified = status === 'Active' || req.body.isVerified;
      const updateData: any = {};
      if (status) updateData['isVerified'] = status === 'Active';
      if (req.body.businessName) updateData['donorProfile.businessName'] = req.body.businessName;
      if (req.body.businessType) updateData['donorProfile.businessType'] = req.body.businessType;

      const user = await User.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
      if (!user) return res.status(404).json({ message: 'Donor not found' });
      res.json(fmt(user));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/admin/ngos/', async (req, res) => {
    try {
      const ngos = await User.find({ role: 'NGO' });
      const formatted = ngos.map((u: any) => ({
        id: u._id.toString(),
        name: u.ngoProfile?.name || u.username,
        registration_no: u.ngoProfile?.registrationId || 'PENDING',
        service_areas: [u.ngoProfile?.location || 'Central Zone'],
        beneficiaries: u.ngoProfile?.stats?.beneficiariesHelped || 120,
        status: u.isVerified ? 'Active' : 'Pending'
      }));
      res.json(formatted);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.patch('/api/admin/ngos/:id/', async (req, res) => {
    try {
      const { status } = req.body;
      const updateData: any = {};
      if (status) updateData['isVerified'] = status === 'Active';
      if (req.body.name) updateData['ngoProfile.name'] = req.body.name;

      const user = await User.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
      if (!user) return res.status(404).json({ message: 'NGO not found' });
      res.json(fmt(user));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/admin/volunteers/', async (req, res) => {
    try {
      const volunteers = await User.find({ role: 'VOLUNTEER' });
      const formatted = volunteers.map((u: any) => ({
        id: u._id.toString(),
        user_name: u.username,
        zone: u.volunteerProfile?.zone || 'North Mumbai',
        volunteer_areas: [u.volunteerProfile?.zone || 'North Mumbai'],
        tasks_completed: u.volunteerProfile?.tasksCompleted || 0,
        rating: u.volunteerProfile?.rating || 5.0,
        status: u.volunteerProfile?.status || 'available',
        vehicle: u.volunteerProfile?.vehicleType || 'Bike',
        verification_status: u.isVerified ? 'Approved' : 'Pending'
      }));
      res.json(formatted);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.patch('/api/admin/volunteers/:id/', async (req, res) => {
    try {
      const { status, verification_status } = req.body;
      const updateData: any = {};
      if (verification_status) updateData['isVerified'] = verification_status === 'Approved';
      if (status) updateData['volunteerProfile.status'] = status;

      const user = await User.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
      if (!user) return res.status(404).json({ message: 'Volunteer not found' });
      res.json(fmt(user));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // ─── Admin Dashboard Stats ───
  app.get('/api/admin/dashboard/stats/', async (req, res) => {
    try {
      const [totalUsers, totalDonations, pendingNGOs, activeDonors] = await Promise.all([
        User.countDocuments({ role: { $in: ['DONOR', 'NGO', 'VOLUNTEER'] } }),
        Donation.countDocuments(),
        User.countDocuments({ role: 'NGO', isVerified: false }),
        User.countDocuments({ role: 'DONOR', isVerified: true })
      ]);
      res.json({
        total_donations: totalDonations,
        total_users: totalUsers,
        pending_ngos: pendingNGOs,
        active_donors: activeDonors
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // ─── Admin Donations ───
  app.get('/api/admin/donations/', async (req, res) => {
    try {
      const { status } = req.query;
      const query: any = {};
      if (status) query.status = status;
      const donations = await Donation.find(query);
      const formatted = donations.map((d: any) => ({
        id: d._id.toString(),
        donor_name: d.donor || 'Private Donor',
        food_type: d.foodType,
        quantity: d.quantity,
        pickup_time: d.date,
        status: d.status,
        assigned_volunteer: d.volunteer ? true : false,
        volunteer_name: d.volunteer?.name || null
      }));
      res.json(formatted);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.patch('/api/admin/donations/:id/', async (req, res) => {
    try {
      const { status, volunteer } = req.body;
      const updateData: any = {};
      if (status) {
        updateData.status = status;
      }
      if (volunteer) {
        updateData.volunteer = volunteer;
      }
      const d = await Donation.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
      if (!d) return res.status(404).json({ message: 'Donation not found' });
      res.json(fmt(d));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // ─── Admin Rewards Catalog ───
  app.get('/api/admin/rewards/', async (req, res) => {
    try {
      const rewards = await Reward.find({});
      res.json(fmtAll(rewards));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/admin/rewards/', async (req, res) => {
    try {
      const r = await Reward.create(req.body);
      res.json(fmt(r));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.patch('/api/admin/rewards/:id/', async (req, res) => {
    try {
      const r = await Reward.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!r) return res.status(404).json({ message: 'Reward not found' });
      res.json(fmt(r));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.delete('/api/admin/rewards/:id/', async (req, res) => {
    try {
      await Reward.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // ─── Admin Config / Settings ───
  app.get('/api/admin/config/:key/', async (req, res) => {
    try {
      const items = await ConfigItem.find({ key: req.params.key });
      res.json(fmtAll(items));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.put('/api/admin/config/:key/', async (req, res) => {
    try {
      const item = await ConfigItem.findOneAndUpdate({ key: req.params.key }, req.body, { new: true });
      if (!item) return res.status(404).json({ message: 'Config not found' });
      res.json(fmt(item));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/admin/config/', async (req, res) => {
    try {
      const item = await ConfigItem.create(req.body);
      res.json(fmt(item));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // ─── NGO Inventory ───
  app.get('/api/inventory/', async (req: AuthenticatedRequest, res) => {
    try {
      const query: any = {};
      if (req.user && req.user.role === 'NGO') {
        query.ngo = req.user._id;
      }
      const items = await Inventory.find(query);
      res.json(fmtAll(items));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/inventory/', async (req: AuthenticatedRequest, res) => {
    try {
      const input = {
        ...req.body,
        ngo: req.user ? req.user._id : new mongoose.Types.ObjectId('6a19bd8080064a1fc2195a11')
      };
      const item = await Inventory.create(input);
      res.json(fmt(item));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.patch('/api/inventory/:id/', async (req, res) => {
    try {
      const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!item) return res.status(404).json({ message: 'Inventory item not found' });
      res.json(fmt(item));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.delete('/api/inventory/:id/', async (req, res) => {
    try {
      await Inventory.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // ─── Profile Endpoints ───
  app.get('/api/donor-profiles/me/', async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user || await User.findOne({ role: 'DONOR' });
      if (!user) return res.status(404).json({ message: 'Donor user not found' });
      res.json({
        businessName: user.donorProfile?.businessName || '',
        businessType: user.donorProfile?.businessType || '',
        registrationId: user.donorProfile?.registrationId || '',
        taxId: user.donorProfile?.taxId || '',
        name: user.username,
        email: user.email,
        phone: user.phone || '',
        location: user.donorProfile?.address?.line1 || '',
        memberSince: 'January 2025',
        verificationLevel: user.donorProfile?.verificationLevel || 'Level I',
        completion: user.donorProfile?.profileCompleteness || 80,
        bankName: user.paymentMethods?.bankAccounts?.[0]?.bankName || null,
        accountNumber: user.paymentMethods?.bankAccounts?.[0]?.accountNumber || null,
        upiId: user.paymentMethods?.upiIds?.[0]?.vpa || null,
        branch: user.paymentMethods?.bankAccounts?.[0]?.ifscCode || null
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.patch('/api/donor-profiles/me/', async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user || await User.findOne({ role: 'DONOR' });
      if (!user) return res.status(404).json({ message: 'Donor user not found' });
      const updated = await User.findByIdAndUpdate(user._id, { $set: { donorProfile: req.body } }, { new: true });
      res.json(fmt(updated));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/ngo-profiles/me/', async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user || await User.findOne({ role: 'NGO' });
      if (!user) return res.status(404).json({ message: 'NGO user not found' });
      res.json({
        ngoName: user.ngoProfile?.name || 'Helping Hands NGO',
        ngoType: user.ngoProfile?.category || 'Social Welfare',
        registrationId: user.ngoProfile?.registrationId || 'REG-12345',
        taxId: user.ngoProfile?.taxId || '80G-EXEMPT',
        managerName: user.ngoProfile?.managingDirector || 'Sarah Michaels',
        email: user.email,
        phone: user.phone || '',
        location: 'New York, NY',
        memberSince: 'January 2025',
        verificationLevel: 'Verified Partner',
        bankName: user.paymentMethods?.bankAccounts?.[0]?.bankName || 'HDFC Bank',
        accountNumber: user.paymentMethods?.bankAccounts?.[0]?.accountNumber || '**** 8824',
        upiId: user.paymentMethods?.upiIds?.[0]?.vpa || 'charity@okaxis',
        donation_points: user.gamification?.points || 0,
        beneficiaries_helped_count: user.ngoProfile?.stats?.beneficiariesHelped || 120,
        total_donations_count: user.ngoProfile?.stats?.totalDonations || 0
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/volunteer-profiles/me/', async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user || await User.findOne({ role: 'VOLUNTEER' });
      if (!user) return res.status(404).json({ message: 'Volunteer user not found' });
      res.json({
        donation_points: user.gamification?.points || 0,
        zone: user.volunteerProfile?.zone || 'North Mumbai',
        vehicleType: user.volunteerProfile?.vehicleType || 'Bike',
        tasksCompleted: user.volunteerProfile?.tasksCompleted || 0,
        rating: user.volunteerProfile?.rating || 4.8
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // ─── Profile Payment Methods CRUD ───
  app.get('/api/donor-profiles/me/payment-methods/', async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user || await User.findOne({ role: 'DONOR' });
      res.json(user.paymentMethods || {});
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/donor-profiles/me/payment-methods/', async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user || await User.findOne({ role: 'DONOR' });
      if (!user) return res.status(404).json({ message: 'User not found' });
      const { bankAccount, upiId } = req.body;
      let updatedUser;
      if (bankAccount) {
        updatedUser = await User.findByIdAndUpdate(user._id, { $push: { 'paymentMethods.bankAccounts': bankAccount } }, { new: true });
      } else if (upiId) {
        updatedUser = await User.findByIdAndUpdate(user._id, { $push: { 'paymentMethods.upiIds': upiId } }, { new: true });
      } else {
        updatedUser = user;
      }
      if (!updatedUser) return res.status(404).json({ message: 'User not found' });
      res.json(updatedUser.paymentMethods || {});
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.delete('/api/donor-profiles/me/payment-methods/:id/', async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user || await User.findOne({ role: 'DONOR' });
      if (!user) return res.status(404).json({ message: 'User not found' });
      const updatedUser = await User.findByIdAndUpdate(user._id, {
        $pull: {
          'paymentMethods.bankAccounts': { _id: req.params.id },
          'paymentMethods.upiIds': { _id: req.params.id }
        }
      }, { new: true });
      if (!updatedUser) return res.status(404).json({ message: 'User not found' });
      res.json(updatedUser.paymentMethods || {});
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // ─── Donations lifecycle (NGO / Volunteer) ───
  app.get('/api/donations/', async (req, res) => {
    try {
      const { marketplace, status } = req.query;
      const query: any = {};
      if (marketplace === 'true') {
        query.status = 'PENDING';
      } else if (status) {
        query.status = status;
      }
      const donations = await Donation.find(query);
      res.json(fmtAll(donations));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/donations/my_requests/', async (req: AuthenticatedRequest, res) => {
    try {
      const ngoName = req.user?.ngoProfile?.name || 'Helping Hands NGO';
      // Find all donations claimed by this NGO
      const donations = await Donation.find({ ngo: ngoName });
      
      const formatted = donations.map((d: any) => ({
        id: d._id.toString(),
        food_category: d.category,
        quantity: d.quantity.split(' ')[0] || '10',
        unit: d.quantity.split(' ')[1] || 'kg',
        donor_name: d.donor || 'Private Donor',
        donor_hotel: d.donor || 'Private Donor',
        contact_phone: '9876543210',
        status: d.status,
        created_at: d.createdAt,
        pickup_address: d.pickupAddress,
        accepted_volunteer_detail: d.volunteer ? {
          name: d.volunteer.name,
          phone: d.volunteer.phone
        } : null,
        tracking_history: d.timeline || []
      }));
      res.json(formatted);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/donations/my_tasks/', async (req: AuthenticatedRequest, res) => {
    try {
      const volName = req.user?.username || 'john_v';
      const donations = await Donation.find({ 'volunteer.name': volName });
      res.json(fmtAll(donations));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/donations/:id/accept/', async (req: AuthenticatedRequest, res) => {
    try {
      const ngoName = req.user?.ngoProfile?.name || 'Helping Hands NGO';
      const d = await Donation.findById(req.params.id);
      if (!d) return res.status(404).json({ message: 'Donation not found' });
      d.ngo = ngoName;
      d.status = 'ACCEPTED';
      d.timeline.push({
        status: 'NGO Accepted',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        completed: true,
        description: `Accepted by ${ngoName}`
      });
      await d.save();
      res.json(fmt(d));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/donations/:id/volunteer_accept/', async (req: AuthenticatedRequest, res) => {
    try {
      const volName = req.user?.username || 'john_v';
      const volPhone = req.user?.phone || '9876543210';
      const volRating = req.user?.volunteerProfile?.rating || '4.8';

      const d = await Donation.findById(req.params.id);
      if (!d) return res.status(404).json({ message: 'Donation not found' });
      d.volunteer = { name: volName, phone: volPhone, rating: volRating.toString() };
      d.status = 'ASSIGNED';
      d.timeline.push({
        status: 'Volunteer Assigned',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        completed: true,
        description: `Assigned to volunteer ${volName}`
      });
      await d.save();
      res.json(fmt(d));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/donations/:id/pickup/', async (req, res) => {
    try {
      const { otp } = req.body;
      const d = await Donation.findById(req.params.id);
      if (!d) return res.status(404).json({ message: 'Donation not found' });
      if (otp !== '123456' && otp !== '1234') {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
      d.status = 'PICKED_UP';
      d.timeline.push({
        status: 'Picked Up',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        completed: true,
        description: 'Food collected by volunteer'
      });
      await d.save();
      res.json(fmt(d));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/donations/:id/deliver/', async (req, res) => {
    try {
      const { otp } = req.body;
      const d = await Donation.findById(req.params.id);
      if (!d) return res.status(404).json({ message: 'Donation not found' });
      if (otp !== '123456' && otp !== '1234') {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
      d.status = 'DELIVERED';
      d.timeline.push({
        status: 'Delivered',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        completed: true,
        description: 'Delivered successfully to NGO'
      });
      await d.save();

      // Award points on delivery
      if (d.donor) {
        await User.findOneAndUpdate({ username: d.donor }, { $inc: { 'gamification.points': 100, 'gamification.lifetimePoints': 100 } });
      }
      if (d.volunteer && d.volunteer.name) {
        await User.findOneAndUpdate({ username: d.volunteer.name }, { $inc: { 'gamification.points': 50, 'gamification.lifetimePoints': 50 } });
      }
      if (d.ngo) {
        await User.findOneAndUpdate({ 'ngoProfile.name': d.ngo }, { $inc: { 'gamification.points': 50, 'gamification.lifetimePoints': 50 } });
      }

      res.json(fmt(d));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // ─── NGO Needs ───
  app.get('/api/needs/', async (req, res) => {
    try {
      const { marketplace } = req.query;
      const query: any = {};
      if (marketplace === 'true') {
        query.status = 'Open';
      }
      const needs = await Need.find(query);
      res.json(fmtAll(needs));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/needs/', async (req, res) => {
    try {
      const need = await Need.create(req.body);
      res.json(fmt(need));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/needs/:id/support/', async (req: AuthenticatedRequest, res) => {
    try {
      const { quantity, phone } = req.body;
      const need = await Need.findById(req.params.id);
      if (!need) return res.status(404).json({ message: 'Need not found' });

      const supporterId = req.user ? req.user._id.toString() : '6a1939fe875b850d3dd88b6b';
      
      if (!need.supporterIds.includes(supporterId)) {
        need.supporterIds.push(supporterId);
      }
      need.fulfilledQuantity = (need.fulfilledQuantity || 0) + (parseInt(quantity) || 1);
      if (need.fulfilledQuantity >= need.quantity) {
        need.status = 'Fulfilled';
      } else {
        need.status = 'Fulfilling';
      }
      await need.save();

      // Create a donation automatically representing this support
      await Donation.create({
        foodType: need.itemName,
        category: need.category,
        dietaryType: 'Veg',
        preparationType: 'Restaurant',
        quantity: `${quantity} ${need.unit}`,
        ngo: need.ngo.toString(),
        donor: req.user?.username || 'star_hotel',
        date: new Date().toLocaleDateString(),
        status: 'PENDING',
        pickupAddress: need.distributionAddress || 'Donor Address',
        description: `Supporting need: ${need.itemName}`,
        relatedNeed: need._id.toString()
      });

      res.json(fmt(need));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // ─── Rewards (role-based) ───
  app.get('/api/rewards/', async (req, res) => {
    try {
      const { role } = req.query;
      const query: any = {};
      if (role) query.role = role;
      const rewards = await Reward.find(query);
      res.json(fmtAll(rewards));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/reward-tiers/', async (req, res) => {
    try {
      const { role } = req.query;
      const query: any = {};
      if (role) query.role = role;
      const tiers = await PointsTier.find(query);
      const formatted = tiers.map((t: any) => ({
        id: t._id.toString(),
        name: t.name,
        min_points: t.minPoints,
        max_points: t.maxPoints || null,
        color: t.color || 'text-gray-400',
        benefits: t.benefits
      }));
      res.json(formatted);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/lucky-spin-prizes/', async (req, res) => {
    try {
      const { role } = req.query;
      const query: any = {};
      if (role) query.role = role;
      const prizes = await LuckySpinPrize.find(query);
      res.json(fmtAll(prizes));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/reward-claims/', async (req: AuthenticatedRequest, res) => {
    try {
      const { reward, claim_details } = req.body;
      const r = await Reward.findById(reward);
      if (!r) return res.status(404).json({ message: 'Reward not found' });
      
      const userId = req.user ? req.user._id : new mongoose.Types.ObjectId('6a1939fe875b850d3dd88b6b');
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      if ((user.gamification?.points || 0) < r.pointsRequired) {
        return res.status(400).json({ message: 'Insufficient points' });
      }

      // Deduct points
      await User.findByIdAndUpdate(userId, { $inc: { 'gamification.points': -r.pointsRequired } });

      const claim = await RewardClaim.create({
        user: userId,
        reward: r._id,
        status: 'Pending'
      });

      res.json(fmt(claim));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/reward-claims/', async (req, res) => {
    try {
      const claims = await RewardClaim.find({}).populate('user').populate('reward');
      res.json(fmtAll(claims));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.patch('/api/admin/reward-claims/:id/', async (req, res) => {
    try {
      const { status } = req.body;
      const claim = await RewardClaim.findByIdAndUpdate(req.params.id, { status, processedAt: new Date() }, { new: true }).populate('user').populate('reward');
      if (!claim) return res.status(404).json({ message: 'Claim not found' });
      res.json(fmt(claim));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // ─── Enquiries ───
  app.get('/api/admin/enquiries/', async (req, res) => {
    try {
      const enquiries = await Enquiry.find({}).sort({ createdAt: -1 });
      res.json(fmtAll(enquiries));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // ─── Donation Drafts ───
  app.get('/api/donation-drafts/', async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user ? req.user._id.toString() : '6a1939fe875b850d3dd88b6b';
      const draft = await DonationDraft.findOne({ userId });
      res.json(fmt(draft));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/donation-drafts/', async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user ? req.user._id.toString() : '6a1939fe875b850d3dd88b6b';
      const draft = await DonationDraft.findOneAndUpdate(
        { userId },
        { $set: { ...req.body, userId } },
        { new: true, upsert: true }
      );
      res.json(fmt(draft));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.delete('/api/donation-drafts/', async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user ? req.user._id.toString() : '6a1939fe875b850d3dd88b6b';
      await DonationDraft.findOneAndDelete({ userId });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.listen(port, () => {
    console.log(`🌐 Express REST Server ready at http://localhost:${port}/api/`);
  });
}
