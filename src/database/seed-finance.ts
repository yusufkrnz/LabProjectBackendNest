import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Project, ProjectStatus, MilestoneStatus } from '../entities/project.entity';
import { Payment, PaymentStatus, PaymentMethod } from '../entities/payment.entity';

export async function seedFinanceData(dataSource: DataSource) {
    const userRepository = dataSource.getRepository(User);
    const projectRepository = dataSource.getRepository(Project);
    const paymentRepository = dataSource.getRepository(Payment);

    // Create a test user
    let testUser = await userRepository.findOne({ where: { email: 'test@example.com' } });

    if (!testUser) {
        testUser = userRepository.create({
            name: 'Test User',
            email: 'test@example.com',
            password: '$2b$10$hashedpassword', // You should hash this properly
            role: 'user',
        });
        testUser = await userRepository.save(testUser);
        console.log('✅ Test user created');
    }

    // Create work in progress projects
    const projects = [
        {
            userId: testUser.id,
            projectTitle: 'E-Commerce Website Development',
            clientName: 'John Smith',
            clientAvatar: 'https://ui-avatars.com/api/?name=JS&background=e5e7eb&color=374151&size=48',
            startDate: new Date('2024-12-01'),
            deadline: new Date('2025-02-15'),
            totalBudget: 3500,
            earnedAmount: 1500,
            status: ProjectStatus.ACTIVE,
            milestones: [
                { id: 'm1', title: 'Design Phase', amount: 500, status: MilestoneStatus.PAID },
                { id: 'm2', title: 'Frontend Development', amount: 1000, status: MilestoneStatus.PAID },
                { id: 'm3', title: 'Backend Integration', amount: 1000, status: MilestoneStatus.IN_PROGRESS },
                { id: 'm4', title: 'Testing & Deployment', amount: 1000, status: MilestoneStatus.PENDING },
            ],
        },
        {
            userId: testUser.id,
            projectTitle: 'Mobile App UI/UX Design',
            clientName: 'Emily Chen',
            clientAvatar: 'https://ui-avatars.com/api/?name=EC&background=e5e7eb&color=374151&size=48',
            startDate: new Date('2024-12-10'),
            deadline: new Date('2025-01-20'),
            totalBudget: 2000,
            earnedAmount: 800,
            status: ProjectStatus.ACTIVE,
            milestones: [
                { id: 'm1', title: 'Wireframes', amount: 400, status: MilestoneStatus.PAID },
                { id: 'm2', title: 'High-Fidelity Designs', amount: 400, status: MilestoneStatus.PAID },
                { id: 'm3', title: 'Prototype', amount: 600, status: MilestoneStatus.IN_PROGRESS },
                { id: 'm4', title: 'Final Delivery', amount: 600, status: MilestoneStatus.PENDING },
            ],
        },
        {
            userId: testUser.id,
            projectTitle: 'API Integration Project',
            clientName: 'Michael Brown',
            clientAvatar: 'https://ui-avatars.com/api/?name=MB&background=e5e7eb&color=374151&size=48',
            startDate: new Date('2024-11-20'),
            deadline: new Date('2024-12-30'),
            totalBudget: 1800,
            earnedAmount: 1800,
            status: ProjectStatus.PENDING_PAYMENT,
            milestones: [
                { id: 'm1', title: 'API Design', amount: 600, status: MilestoneStatus.PAID },
                { id: 'm2', title: 'Implementation', amount: 800, status: MilestoneStatus.PAID },
                { id: 'm3', title: 'Documentation', amount: 400, status: MilestoneStatus.COMPLETED },
            ],
        },
    ];

    for (const projectData of projects) {
        const existingProject = await projectRepository.findOne({
            where: { projectTitle: projectData.projectTitle, userId: testUser.id },
        });

        if (!existingProject) {
            const project = projectRepository.create(projectData);
            await projectRepository.save(project);
            console.log(`✅ Project created: ${projectData.projectTitle}`);
        }
    }

    // Create payment history
    const payments = [
        {
            userId: testUser.id,
            projectTitle: 'Landing Page Design',
            clientName: 'Sarah Wilson',
            clientAvatar: 'https://ui-avatars.com/api/?name=SW&background=e5e7eb&color=374151&size=48',
            amount: 750,
            paymentDate: new Date('2024-12-18'),
            paymentMethod: PaymentMethod.BANK_TRANSFER,
            status: PaymentStatus.COMPLETED,
            transactionId: 'TXN-2024-001',
        },
        {
            userId: testUser.id,
            projectTitle: 'WordPress Theme Customization',
            clientName: 'David Lee',
            clientAvatar: 'https://ui-avatars.com/api/?name=DL&background=e5e7eb&color=374151&size=48',
            amount: 450,
            paymentDate: new Date('2024-12-15'),
            paymentMethod: PaymentMethod.PAYPAL,
            status: PaymentStatus.COMPLETED,
            transactionId: 'TXN-2024-002',
        },
        {
            userId: testUser.id,
            projectTitle: 'Logo Design Package',
            clientName: 'Anna Martinez',
            clientAvatar: 'https://ui-avatars.com/api/?name=AM&background=e5e7eb&color=374151&size=48',
            amount: 300,
            paymentDate: new Date('2024-12-10'),
            paymentMethod: PaymentMethod.CREDIT_CARD,
            status: PaymentStatus.COMPLETED,
            transactionId: 'TXN-2024-003',
        },
        {
            userId: testUser.id,
            projectTitle: 'SEO Optimization',
            clientName: 'Robert Johnson',
            clientAvatar: 'https://ui-avatars.com/api/?name=RJ&background=e5e7eb&color=374151&size=48',
            amount: 600,
            paymentDate: new Date('2024-12-05'),
            paymentMethod: PaymentMethod.BANK_TRANSFER,
            status: PaymentStatus.COMPLETED,
            transactionId: 'TXN-2024-004',
        },
        {
            userId: testUser.id,
            projectTitle: 'React Dashboard Development',
            clientName: 'Chris Anderson',
            clientAvatar: 'https://ui-avatars.com/api/?name=CA&background=e5e7eb&color=374151&size=48',
            amount: 1200,
            paymentDate: new Date('2024-12-01'),
            paymentMethod: PaymentMethod.BANK_TRANSFER,
            status: PaymentStatus.COMPLETED,
            transactionId: 'TXN-2024-005',
        },
        {
            userId: testUser.id,
            projectTitle: 'Mobile App Consultation',
            clientName: 'Lisa Thompson',
            clientAvatar: 'https://ui-avatars.com/api/?name=LT&background=e5e7eb&color=374151&size=48',
            amount: 200,
            paymentDate: new Date('2024-11-28'),
            paymentMethod: PaymentMethod.PAYPAL,
            status: PaymentStatus.COMPLETED,
            transactionId: 'TXN-2024-006',
        },
        {
            userId: testUser.id,
            projectTitle: 'E-Commerce Integration',
            clientName: 'Mark Davis',
            clientAvatar: 'https://ui-avatars.com/api/?name=MD&background=e5e7eb&color=374151&size=48',
            amount: 850,
            paymentDate: new Date('2024-11-25'),
            paymentMethod: PaymentMethod.CREDIT_CARD,
            status: PaymentStatus.COMPLETED,
            transactionId: 'TXN-2024-007',
        },
    ];

    for (const paymentData of payments) {
        const existingPayment = await paymentRepository.findOne({
            where: { transactionId: paymentData.transactionId },
        });

        if (!existingPayment) {
            const payment = paymentRepository.create(paymentData);
            await paymentRepository.save(payment);
            console.log(`✅ Payment created: ${paymentData.transactionId}`);
        }
    }

    console.log('🎉 Finance data seeding completed!');
}
