export enum ERole {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

export enum EGender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER',
}

export enum EPackageType {
    FREE = 'FREE',
    BASIC = 'BASIC',
    PREMIUM = 'PREMIUM',
}

export interface IAddress {
    id: string;
    detail: string;
    ward: string;
    district?: string;
    city: string;
    country: string;
    user?: IUser | null;
}

export interface ISession {
    id: string;
    userId: string;
    user?: IUser;
    expiresAt: string;
    createdAt: string;
}

export interface IName {
    userId: string;
    firstName: string;
    lastName: string;
}

export interface IUser {
    id: string;
    email: string;
    username: string | null;
    passwordHash?: string;
    fullName?: string | null;
    gender: EGender;

    avatarUrl?: string | null;
    avatarFileId?: string | null;
    role: ERole;
    gradeLevel?: number | null;
    dateOfBirth?: string | null;

    bio?: string | null;
    phone?: string | null;
    addressId?: string | null;
    address?: IAddress | null;

    isActive: boolean;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string | null;

    userQuota?: IUserQuota | null;
    quotaLedgers?: IQuotaLedger[] | null;
}

export interface IAddress {
    id: string;
    detail: string;
    ward: string;
    district?: string;
    city: string;
    country: string;
    user?: IUser | null;
}

export interface IUserAuthProvider {
    id: string;
    userId: string;
    provider: string;
    providerUserId: string;
    createdAt: string;

    user?: IUser | null;
}

export interface IVerficationToken {
    id: string;
    userId: string | null;
    email: string | null;
    code: string;
    type: string;
    resendCount: number;
    lastResendAt: string | null;
    channel: string;
    expiresAt: string;
    createdAt: string;
    used: boolean;
    user?: IUser | null
}

export interface ILoginResponse {
    user: IUser;
    accessToken: string;
    refreshToken: string;
}

export interface IPackage {
    packageId: string;
    name: string;
    type: EPackageType;
    isPopular: boolean;

    price: number;
    discountPrice?: number | null;
    unitPrice: string;

    maxCredits: number;
    maxCreateVideos: number;
    maxChatMessages: number;
    maxFlashcards: number;
    maxVoiceCalls: number;
    bonusCredits?: number | null;

    canShareContent?: boolean;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export enum EUserPackageStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    REFUND_IN_PROGRESS = 'REFUND_IN_PROGRESS',
    REFUNDED = 'REFUNDED'
}

export interface IUserPackage {
    id: string;
    userId: string;
    packageId: string;
    paymentMethod: string;
    amountPaid: number;

    transactionId?: string | null;
    package?: IPackage | null;
    user?: IUser | null;

    status: EUserPackageStatus;
    purchasedAt: string;
}

export enum ETransactionType {
    EARNED_QUIZ = 'EARNED_QUIZ',
    SPENT_FLASHCARD = 'SPENT_FLASHCARD',
    SPENT_VIDEO = 'SPENT_VIDEO',
    SPENT_VIDEO_CALL = 'SPENT_VIDEO_CALL',
    SPENT_CHAT_MESSAGE = 'SPENT_CHAT_MESSAGE',
    BONUS = 'BONUS',
    REFUND = 'REFUND',
    ADMIN_ADJUSTMENT = 'ADMIN_ADJUSTMENT',
}

export enum EQuotaActionType {
    PACKAGE_PURCHASE = 'PACKAGE_PURCHASE',
    QUIZ_REWARD = 'QUIZ_REWARD',
    CHAT_USAGE = 'CHAT_USAGE',
    VIDEO_USAGE = 'VIDEO_USAGE',
    FLASHCARD_USAGE = 'FLASHCARD_USAGE',
    BONUS = 'BONUS',
    REFUND = 'REFUND',
    ADMIN_ADJUSTMENT = 'ADMIN_ADJUSTMENT',
    EXPIRATION = 'EXPIRATION',
}

export interface IUserQuota {
    userId: string
    totalCredits: number
    usedCredits: number
    remainingCredits: number
    totalChatMessages: number
    usedChatMessages: number
    remainingChatMessages: number
    totalCreateVideos: number
    usedCreateVideos: number
    remainingCreateVideos: number
    totalFlashcards: number
    usedFlashcards: number
    remainingFlashcards: number
    totalVoiceCalls: number
    usedVoiceCalls: number
    remainingVoiceCalls: number
    lastReconciledAt: Date | null
    createdAt: Date
    updatedAt: Date

    user?: IUser | null
}

export interface IQuotaLedger {
    id: string
    userId: string
    actionType: EQuotaActionType
    creditDelta: number
    chatMessageDelta: number
    createVideoDelta: number
    flashcardDelta: number
    voiceCallDelta: number
    referenceType: string | null
    referenceId: string | null
    description: string | null
    createdAt: Date

    user?: IUser | null
}

export enum EFlashcardStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}

export interface IFlashcardSet {
    id: string
    userId: string | null
    title: string
    description: string | null
    subject: string | null
    gradeLevel: number | null
    aiModel: string | null
    generationStatus: EFlashcardStatus
    isOfSystem: boolean
    isPublic: boolean
    isFeatured: boolean
    viewCount: number
    cloneCount: number
    likeCount: number
    doCount: number
    createdAt: Date
    updatedAt: Date

    user?: IUser | null
    flashcards?: IFlashcard[] | null
}

export enum EFlashcardType {
    BASIC = 'BASIC',
    MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
    TRUE_FALSE = 'TRUE_FALSE',
    FILL_IN_THE_BLANK = 'FILL_IN_THE_BLANK',
}

export interface IFlashcard {
    id: string
    flashcardSetId: string
    frontImageFileId: string | null
    backImageFileId: string | null
    audioFileId: string | null
    type: EFlashcardType
    frontContent: string
    backContent: string
    frontImageUrl: string | null
    backImageUrl: string | null
    audioUrl: string | null
    cardOrder: number
    createdAt: Date

    frontImageFileUrl?: string | null
    backImageFileUrl?: string | null
    audioFileUrl?: string | null

    flashcardSet?: IFlashcardSet | null
}

export enum EGenerationStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}

export interface IVideo {
    id: string
    userId: string | null
    videoFileId: string | null
    thumbnailFileId: string | null
    title: string
    description: string | null
    subject: string | null
    gradeLevel: number | null
    aiModel: string | null
    generationStatus: EGenerationStatus
    videoUrl: string | null
    thumbnailUrl: string | null
    duration: number | null
    fileSize: number | null
    scriptContent: string | null
    transcript: string | null
    isPublic: boolean
    isFeatured: boolean
    viewCount: number
    likeCount: number
    createdAt: Date
    updatedAt: Date
}

export interface IQuiz {
    id: string
    userId: string | null
    isOfSystem: boolean
    title: string
    description: string | null
    subject: string | null
    gradeLevel: number | null
    aiModel: string | null
    generationStatus?: EGenerationStatus | null
    timeLimit: number | null
    passingScorePercentage?: number | null
    pointsToComplete?: number
    pointsToEarn?: number
    giftCredits?: number
    maxAttemptsPerUser?: number
    isPublic?: boolean
    isFeatured?: boolean
    totalAttempts?: number
    totalCompletions?: number
    averageScore?: number
    createdAt: Date
    updatedAt: Date

    user?: IUser | null
    questions?: IQuizQuestion[] | null
}

export interface IQuizQuestion {
    id: string
    quizId: string
    questionImageFileId: string | null
    questionTitle: string
    questionText: string
    questionImageUrl: string | null
    correctAnswer: string[]
    explanation: string | null
    questionType: string
    points: number
    questrionOrder: number
    createdAt: Date

    quiz?: IQuiz | null
}

export interface IQuizAnswerOption {
    id: string
    questionId: string
    optionImageFileId: string | null
    optionLabel: string
    optionText: string
    optionImageUrl: string | null
    optionOrder: number
    createdAt: Date

    question?: IQuizQuestion | null
}

export interface IQuizAttempt {
    id: string
    userId: string
    quizId: string
    score: number | null
    maxScore: number
    isPassed: boolean | null
    startedAt: Date
    completedAt: Date | null
    timeSpentSeconds: number | null
    pointsEarned: number | null
    createdAt: Date

    user?: IUser | null
    quiz?: IQuiz | null
    answers?: IQuizAttemptAnswer[] | null
}

export interface IQuizAttemptAnswer {
    id: string
    attemptId: string
    questionId: string
    selectedOptions: string[]
    isCorrect: boolean | null
    pointsEarned: number | null
    answeredAt: Date

    attempt?: IQuizAttempt | null
    question?: IQuizQuestion | null
}

export interface IContentLike {
    id: string
    userId: string
    contentType: string
    contentId: string
    createdAt: Date

    user?: IUser | null
}

export interface IContentComment {
    id: string
    userId: string
    contentType: string
    contentId: string
    commentText: string
    parentCommentId: string | null
    isEdited: boolean | null
    isDeleted: boolean | null
    createdAt: Date
    updatedAt: Date

    user?: IUser | null
    parentComment?: IContentComment | null
    replies?: IContentComment[] | null
}

export interface IChatConversation {
    id: string
    userId: string
    title: string | null
    subject: string | null
    gradeLevel: number | null
    createdAt: Date
    updatedAt: Date

    messages?: IChatMessage[] | null
    user?: IUser | null
}

export interface IChatMessage {
    messageId: string
    conversationId: string
    attachmentFileId: string | null
    role: string
    contentType: string
    content: string
    hasAttachment: boolean
    attachmentType: string | null
    attachmentUrl: string | null
    createdAt: Date
}

export interface INotification {
    notificationId: string
    userId: string
    notificationType: string
    title: string
    message: string
    actionUrl: string | null
    isRead: boolean
    createdAt: Date

    user?: IUser | null
}

export interface ISubject {
    subjectId: string
    iconFileId: string | null
    subjectName: string
    subjectCode: string
    description: string | null
    iconUrl: string | null
    colorHex: string | null
    displayOrder: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

export interface ITestCategory {
    categoryId: string
    iconFileId: string | null
    categoryName: string
    categoryCode: string
    description: string | null
    iconUrl: string | null
    displayOrder: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

export interface IBookmark {
    bookmarkId: string
    userId: string
    contentType: string
    contentId: string
    notes: string | null
    createdAt: Date

    user?: IUser | null
}

export enum EFileType {
    avatar = 'avatar',
    thumbnail = 'thumbnail',
    video = 'video',
    image = 'image',
    audio = 'audio',
    document = 'document',
    raw_upload = 'raw_upload'
}

export enum EFileStatus {
    pending = 'pending',
    processing = 'processing',
    completed = 'completed',
    failed = 'failed'
}

export interface IFile {
    id: string
    ownerId: string | null
    bucketName?: string | null
    storageKey?: string | null
    originalFileName: string
    storedFileName: string
    fileExtension: string
    fileType: EFileType
    mimeType: string
    sizeBytes: number
    storageUrl: string
    cdnUrl: string | null
    signedUrl: string | null
    signedUrlExpiresAt: Date | null
    visibility?: string | null
    status: EFileStatus
    createdAt: Date
    updatedAt: Date
    deletedByUserId?: string | null
    deleteReason?: string | null

    owner?: IUser | null
    deletedByUser?: IUser | null
}

export interface IFileUsage {
    id: string
    fileId: string
    entityType: string
    entityId: string
    usageType: string
    createdAt: Date
    displayOrder: number

    file?: IFile | null
}

export interface IContact {
    contactId: string
    userId: string | null
    fullName: string
    email: string
    phone: string | null
    subject: string | null
    content: string | null
    isRead: boolean
    userIdReply: string | null
    reply: string | null
    repliedAt: Date | null
    createdAt: Date
    updatedAt: Date

    user?: IUser | null
    userReply?: IUser | null
}

export interface IFeedback {
    feedbackId: string
    userId: string
    content: string
    rating: number | null
    createdAt: Date
    updatedAt: Date

    user?: IUser | null
}

export interface IReviewApp {
    id: string
    userId: string | null
    rating: number | null
    content: string | null
    createdAt: Date
    updatedAt: Date

    user?: IUser | null
}