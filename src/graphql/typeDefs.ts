export const typeDefs = `#graphql

  enum Urgency {
    LOW
    MEDIUM
    HIGH
    URGENT
  }

  # ─── Shared ──────────────────────────────────────────────────────────────────
  type Timeline {
    status: String
    date: String
    time: String
    completed: Boolean
    description: String
  }

  type VolunteerInfo {
    name: String
    phone: String
    rating: String
  }

  type Address {
    line1: String
    city: String
    state: String
    postalCode: String
  }

  type BankAccount {
    id: ID
    bankName: String
    accountHolder: String
    accountNumber: String
    ifscCode: String
    isPrimary: Boolean
    isVerified: Boolean
  }

  type UPIId {
    id: ID
    vpa: String
    label: String
    isPrimary: Boolean
    isVerified: Boolean
  }

  type PaymentMethods {
    bankAccounts: [BankAccount]
    upiIds: [UPIId]
  }

  type Badge {
    name: String
    earnedAt: String
  }

  type PointsHistoryEntry {
    points: Int
    reason: String
    createdAt: String
  }

  type Gamification {
    points: Int
    lifetimePoints: Int
    badges: [Badge]
    pointsHistory: [PointsHistoryEntry]
  }

  # ─── User / Auth ──────────────────────────────────────────────────────────────
  type DonorDocument {
    name: String
    status: String
    date: String
    url: String
  }

  type DonorProfile {
    businessName: String
    businessType: String
    subCategory: String
    verificationLevel: String
    registrationId: String
    profileCompleteness: Int
    taxId: String
    legalName: String
    website: String
    entityType: String
    alternateContact: String
    address: Address
    documents: [DonorDocument]
  }

  type NGOStats {
    totalDonations: Int
    beneficiariesHelped: Int
    activeNeeds: Int
  }

  type NGOProfile {
    name: String
    registrationId: String
    category: String
    managingDirector: String
    taxId: String
    currentTier: String
    stats: NGOStats
  }

  type VolunteerProfile {
    name: String
    zone: String
    skills: [String]
    rating: Float
    tasksCompleted: Int
    vehicleType: String
    status: String
  }

  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    avatar: String
    phone: String
    isVerified: Boolean
    donorProfile: DonorProfile
    ngoProfile: NGOProfile
    volunteerProfile: VolunteerProfile
    paymentMethods: PaymentMethods
    gamification: Gamification
    createdAt: String
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  type Coordinates {
    lat: Float
    lng: Float
  }

  # ─── Donation ─────────────────────────────────────────────────────────────────
  type Donation {
    id: ID!
    foodType: String!
    category: String!
    dietaryType: String!
    preparationType: String!
    quantity: String!
    ngo: String
    donor: String
    donorDetails: User
    date: String!
    status: String!
    pickupAddress: String
    deliveryAddress: String
    description: String
    expiryTime: String
    volunteer: VolunteerInfo
    volunteerLocation: Coordinates
    pickupCoords: Coordinates
    deliveryCoords: Coordinates
    image: String
    timeline: [Timeline]
    isNgoNeed: Boolean
    relatedNeed: String
    createdAt: String
  }

  type DonationDraft {
    id: ID!
    userId: String!
    foodType: String
    category: String
    dietaryType: String
    preparationType: String
    quantity: String
    ngo: String
    donor: String
    date: String
    pickupAddress: String
    deliveryAddress: String
    description: String
    expiryTime: String
    image: String
    relatedNeed: String
    createdAt: String
    updatedAt: String
  }

  type NeedSupporterInfo {
    id: ID!
    name: String!
    quantity: String!
  }

  # ─── Need ─────────────────────────────────────────────────────────────────────
  type Need {
    id: ID!
    ngo: String
    ngoName: String
    itemName: String!
    category: String!
    quantity: Int
    unit: String
    urgency: Urgency
    requiredBy: String
    image: String
    distributionAddress: String
    description: String
    status: String
    fulfilledQuantity: Int
    supporterIds: [String]
    supporters: [User]
    supportersDetails: [NeedSupporterInfo]
    createdAt: String
  }

  # ─── Inventory ────────────────────────────────────────────────────────────────
  type Inventory {
    id: ID!
    ngo: String
    itemName: String!
    category: String!
    quantity: Int
    unit: String
    expiryDate: String
    storageLocation: String
    itemCondition: String
    status: String
    sourceDonation: String
    createdAt: String
  }

  # ─── Reward ──────────────────────────────────────────────────────────────────
  type Reward {
    id: ID!
    name: String!
    description: String
    pointsRequired: Int!
    category: String!
    role: String!
    amount: String
    available: Boolean
    image_url: String
    status: String
    createdAt: String
  }

  type RewardClaim {
    id: ID!
    user: User
    reward: Reward
    status: String
    claimedAt: String
    processedAt: String
  }

  # ─── Lucky Spin ───────────────────────────────────────────────────────────────
  type LuckyPrize {
    id: ID!
    role: String!
    label: String!
    prizeType: String
    value: Float
    icon: String
    probability: Float
    isActive: Boolean
  }

  type LuckySpinDraw {
    id: ID!
    user: User
    prize: LuckyPrize
    drawnAt: String
  }

  type SpinResult {
    draw: LuckySpinDraw!
    prize: LuckyPrize!
    pointsAwarded: Int
  }

  # ─── Enquiry ──────────────────────────────────────────────────────────────────
  type Enquiry {
    id: ID!
    userId: String
    name: String!
    email: String!
    phone: String
    subject: String
    message: String!
    role: String
    status: String
    createdAt: String
  }

  # ─── Config (Dropdown options) ────────────────────────────────────────────────
  type ConfigItem {
    id: ID!
    key: String!
    name: String!
    description: String
    color: String
    isActive: Boolean
    sortOrder: Int
  }

  # ─── Milestone / Badge ────────────────────────────────────────────────────────
  type Milestone {
    id: ID!
    name: String!
    desc: String
    category: String!
    requirementType: String!
    threshold: Int!
    icon: String
    active: Boolean
    createdAt: String
  }

  # ─── Admin Dashboard ──────────────────────────────────────────────────────────
  type DashboardStats {
    totalDonors: Int
    totalNGOs: Int
    totalVolunteers: Int
    totalDonations: Int
    pendingDonations: Int
    totalRewardClaims: Int
    totalEnquiries: Int
    activeNeeds: Int
  }


  # ─── Common Category Suggestions ─────────────────────────────────────────────
  type CategorySuggestion {
    id: ID!
    name: String!
    type: String!
    isActive: Boolean
  }

  # ─── Points Tier ─────────────────────────────────────────────────────────────
  type PointsTier {
    id: ID!
    name: String!
    role: String!
    minPoints: Int!
    maxPoints: Int
    color: String
    benefits: [String]
    isActive: Boolean
  }

  # ─── Inputs ──────────────────────────────────────────────────────────────────
  input RegisterInput {
    username: String!
    email: String!
    password: String!
    role: String!
    phone: String
  }

  input LoginInput {
    email: String!
    password: String!
    role: String!
  }

  input DonorProfileInput {
    username: String
    businessName: String
    businessType: String
    subCategory: String
    taxId: String
    address: AddressInput
  }

  input NGOProfileInput {
    name: String
    registrationId: String
    category: String
    managingDirector: String
    taxId: String
  }

  input VolunteerProfileInput {
    name: String
    zone: String
    skills: [String]
    vehicleType: String
    status: String
  }

  input AddressInput {
    line1: String
    city: String
    state: String
    postalCode: String
  }

  input CreateDonationInput {
    foodType: String!
    category: String!
    dietaryType: String!
    preparationType: String!
    quantity: String!
    ngo: String
    donor: String
    date: String!
    pickupAddress: String!
    deliveryAddress: String
    description: String!
    expiryTime: String
    image: String
    relatedNeed: String
  }

  input DonationDraftInput {
    foodType: String
    category: String
    dietaryType: String
    preparationType: String
    quantity: String
    ngo: String
    donor: String
    date: String
    pickupAddress: String
    deliveryAddress: String
    description: String
    expiryTime: String
    image: String
    relatedNeed: String
  }

  input CreateNeedInput {
    ngo: String!
    itemName: String!
    category: String!
    quantity: Int
    unit: String
    urgency: String
    requiredBy: String
    image: String
    distributionAddress: String
    description: String
  }

  input AddInventoryInput {
    ngo: String!
    itemName: String!
    category: String!
    quantity: Int
    unit: String
    expiryDate: String
    storageLocation: String
    itemCondition: String
  }

  input BankAccountInput {
    bankName: String!
    accountHolder: String!
    accountNumber: String!
    ifscCode: String!
    isPrimary: Boolean
  }

  input UPIInput {
    vpa: String!
    label: String
    isPrimary: Boolean
  }

  input EnquiryInput {
    userId: String
    name: String!
    email: String!
    phone: String
    subject: String
    message: String!
    role: String
  }

  input ConfigItemInput {
    key: String!
    name: String!
    description: String
    color: String
  }

  input CategorySuggestionInput {
    name: String!
    type: String!
  }

  input MilestoneInput {
    name: String!
    desc: String
    category: String!
    requirementType: String!
    threshold: Int!
    icon: String
  }

  input RewardInput {
    name: String!
    description: String
    pointsRequired: Int!
    category: String!
    role: String!
    amount: String
    image_url: String
  }

  input CreateLuckyPrizeInput {
    role: String!
    label: String!
    prizeType: String
    value: Float
    icon: String
    probability: Float
    isActive: Boolean
  }

  input PointsTierInput {
    name: String!
    role: String!
    minPoints: Int!
    maxPoints: Int
    color: String
    benefits: [String]
    isActive: Boolean
  }

  # ─── Queries ─────────────────────────────────────────────────────────────────
  type Query {
    # Auth
    me(userId: ID!): User

    # Admin
    dashboardStats: DashboardStats
    users(role: String): [User]
    userById(userId: ID!): User

    # Donor
    donations(userId: String, status: String, sortOrder: String, search: String): [Donation]
    donationById(id: ID!): Donation

    # NGO
    needs(ngoId: String, status: String, search: String, urgency: Urgency): [Need]
    need(id: ID!): Need
    needById(id: ID!): Need
    inventory(ngoId: String): [Inventory]

    # Rewards (all roles)
    rewards(role: String): [Reward]
    rewardClaims(userId: String, status: String): [RewardClaim]

    # Lucky Spin
    prizes(role: String): [LuckyPrize]
    mySpins(userId: String): [LuckySpinDraw]

    # Enquiries (admin)
    enquiries(role: String, status: String): [Enquiry]

    # Config / Dropdowns
    configItems(key: String): [ConfigItem]
    categorySuggestions(type: String): [CategorySuggestion]

    # Milestones & Badges
    milestones(category: String): [Milestone]
    gamificationTiers(role: String): [GamificationTier!]!

    # Points Tiers
    pointsTiers(role: String): [PointsTier]

    # Analytics
    donationStats: DonationStats

    # Volunteer Tasks (donations pending pickup)
    volunteerTasks(volunteerId: String): [Donation]

    donationDraft(userId: ID!): DonationDraft

    hello: String
  }

  type DonationStats {
    totalDonations: Int
    pendingCount: Int
    completedCount: Int
    inProgressCount: Int
    totalByCategory: [CategoryCount]
  }

  type CategoryCount {
    category: String
    count: Int
  }

  # ─── Mutations ───────────────────────────────────────────────────────────────
  type Mutation {
    # Auth
    register(input: RegisterInput!): AuthPayload
    login(input: LoginInput!): AuthPayload
    forgotPassword(email: String!): String
    resetPassword(email: String!, newPassword: String!, otp: String): Boolean

    # Profile Updates
    updateDonorProfile(userId: ID!, input: DonorProfileInput!): User
    updateNGOProfile(userId: ID!, input: NGOProfileInput!): User
    updateVolunteerProfile(userId: ID!, input: VolunteerProfileInput!): User
    deleteUser(id: ID!): Boolean

    # Payment Methods
    addBankAccount(userId: ID!, input: BankAccountInput!): User
    updateBankAccount(userId: ID!, accountId: ID!, input: BankAccountInput!): User
    removeBankAccount(userId: ID!, accountId: ID!): User
    addUPI(userId: ID!, input: UPIInput!): User
    updateUPI(userId: ID!, upiId: ID!, input: UPIInput!): User
    removeUPI(userId: ID!, upiId: ID!): User

    # Donations
    createDonation(input: CreateDonationInput!): Donation
    updateDonationStatus(id: ID!, status: String!): Donation
    verifyPickup(id: ID!, otp: String!): Donation
    cancelDonation(id: ID!, reason: String): Donation
    deleteDonation(id: ID!): Boolean
    updateVolunteerLocation(id: ID!, lat: Float!, lng: Float!): Donation

    # NGO Needs
    createNeed(input: CreateNeedInput!): Need
    updateNeed(id: ID!, status: String): Need
    deleteNeed(id: ID!): Boolean

    # Inventory
    addInventoryItem(input: AddInventoryInput!): Inventory
    updateInventoryItem(id: ID!, quantity: Int, status: String): Inventory
    deleteInventoryItem(id: ID!): Boolean

    # Rewards
    createReward(input: RewardInput!): Reward
    updateReward(id: ID!, available: Boolean, status: String): Reward
    deleteReward(id: ID!): Boolean
    claimReward(userId: ID!, rewardId: ID!): RewardClaim
    updateRewardClaim(id: ID!, status: String!): RewardClaim
    deleteRewardClaim(id: ID!): Boolean

    # Lucky Spin
    spinWheel(userId: ID!, role: String!): SpinResult
    createLuckyPrize(input: CreateLuckyPrizeInput!): LuckyPrize
    updateLuckyPrize(id: ID!, role: String, label: String, prizeType: String, value: Float, icon: String, probability: Float, isActive: Boolean): LuckyPrize
    deleteLuckyPrize(id: ID!): Boolean
    deleteLuckySpinDraw(id: ID!): Boolean

    # Enquiry
    submitEnquiry(input: EnquiryInput!): Enquiry
    updateEnquiryStatus(id: ID!, status: String!): Enquiry
    deleteEnquiry(id: ID!): Boolean

    # Config
    addConfigItem(input: ConfigItemInput!): ConfigItem
    updateConfigItem(id: ID!, name: String, description: String, color: String): ConfigItem
    deleteConfigItem(id: ID!): Boolean

    # Category Suggestion
    createCategorySuggestion(input: CategorySuggestionInput!): CategorySuggestion
    updateCategorySuggestion(id: ID!, name: String, type: String, isActive: Boolean): CategorySuggestion
    deleteCategorySuggestion(id: ID!): Boolean

    # Milestones
    createMilestone(input: MilestoneInput!): Milestone
    updateMilestone(id: ID!, active: Boolean, name: String, desc: String, threshold: Int): Milestone
    deleteMilestone(id: ID!): Boolean

    # Points Tiers
    createPointsTier(input: PointsTierInput!): PointsTier
    updatePointsTier(id: ID!, name: String, role: String, minPoints: Int, maxPoints: Int, color: String, benefits: [String], isActive: Boolean): PointsTier
    deletePointsTier(id: ID!): Boolean

    # Admin - Award Points
    awardPoints(userId: ID!, points: Int!, reason: String!): User

    # Donation Drafts
    saveDonationDraft(userId: ID!, input: DonationDraftInput!): DonationDraft
    clearDonationDraft(userId: ID!): Boolean

    # Seed
    seedData: String
  }

  type GamificationTier {
    id: ID!
    name: String!
    role: String!
    range: String!
    bonus: String!
    pointsRequired: Int!
    perks: String!
    color: String!
  }
`;
