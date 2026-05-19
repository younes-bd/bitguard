from django.utils import timezone
from django.contrib.auth import get_user_model
from apps.blog.models import Post, Category

def seed_blog():
    print("Starting blog seeding process...")
    User = get_user_model()
    
    # 1. Create or get an author
    author, created = User.objects.get_or_create(
        username='admin_blog',
        defaults={
            'email': 'admin_blog@bitguard.tech',
            'is_staff': True,
            'is_superuser': True
        }
    )
    if created:
        author.set_password('admin123')
        author.save()
        print("Created admin_blog user.")
    else:
        print("Found existing admin_blog user.")

    # 2. Create Categories
    categories_data = ['Threat Intelligence', 'Zero Trust', 'Cloud Security', 'Compliance']
    categories = {}
    for cat_name in categories_data:
        cat, _ = Category.objects.get_or_create(name=cat_name)
        categories[cat_name] = cat
        print(f"Ensured category: {cat_name}")

    # 3. Create Posts
    posts_data = [
        {
            'title': 'The Evolution of Zero Trust Architecture in 2026',
            'category': categories['Zero Trust'],
            'content': '''
                <h2>Beyond the Buzzword</h2>
                <p>Zero Trust has moved from a marketing buzzword to a fundamental architectural requirement. In this post, we explore how modern enterprises are implementing micro-segmentation and continuous authentication to secure remote workforces.</p>
                <p>Traditionally, security focused on defending the perimeter. Once inside, users had broad access. Zero Trust eliminates the concept of a trusted internal network.</p>
                <h3>Key Tenets of Implementation</h3>
                <ul>
                    <li>Assume Breach</li>
                    <li>Verify Explicitly</li>
                    <li>Least Privilege Access</li>
                </ul>
                <p>By enforcing these principles, organizations can drastically reduce the blast radius of a potential compromise.</p>
            ''',
        },
        {
            'title': 'How AI is Reshaping Endpoint Detection and Response',
            'category': categories['Threat Intelligence'],
            'content': '''
                <h2>The AI Arms Race</h2>
                <p>Attackers are leveraging generative AI to create highly sophisticated phishing campaigns and polymorphic malware. To keep pace, defenders must also utilize artificial intelligence.</p>
                <p>Next-Gen EDR platforms use machine learning models not just to detect known signatures, but to recognize the behavioral patterns of malicious actors "living off the land."</p>
                <h3>What This Means for SOC Teams</h3>
                <p>SOC analysts are no longer sifting through thousands of false positives. AI pre-triages alerts, providing the analyst with a complete attack narrative and recommended remediation steps, reducing Mean Time To Respond (MTTR) by up to 80%.</p>
            ''',
        },
        {
            'title': 'Securing Multi-Cloud Environments: A Strategic Guide',
            'category': categories['Cloud Security'],
            'content': '''
                <h2>The Complexity of Multi-Cloud</h2>
                <p>As organizations adopt hybrid models spanning AWS, Azure, and GCP, maintaining a unified security posture becomes incredibly complex. Misconfigurations remain the leading cause of cloud data breaches.</p>
                <p>Cloud Security Posture Management (CSPM) tools are essential for identifying open S3 buckets, overly permissive IAM roles, and unencrypted databases across all cloud providers simultaneously.</p>
                <h3>Best Practices</h3>
                <ol>
                    <li>Implement Infrastructure as Code (IaC) security scanning.</li>
                    <li>Enforce generic IAM policies across clouds.</li>
                    <li>Utilize centralized logging and SIEM integration.</li>
                </ol>
            ''',
        },
        {
            'title': 'Navigating the New CMMC 2.0 Requirements',
            'category': categories['Compliance'],
            'content': '''
                <h2>What DoD Contractors Need to Know</h2>
                <p>The Cybersecurity Maturity Model Certification (CMMC) 2.0 framework has streamlined requirements, but the enforcement mechanisms are stricter than ever. If you handle Controlled Unclassified Information (CUI), compliance is non-negotiable.</p>
                <p>This article breaks down the three levels of CMMC 2.0 and provides a practical roadmap for achieving Level 2 certification, which aligns with NIST SP 800-171.</p>
                <p>Do not wait until your next contract renewal. The assessment process takes months, and the queue for Certified Third-Party Assessor Organizations (C3PAOs) is growing rapidly.</p>
            ''',
        }
    ]

    for data in posts_data:
        post, created = Post.objects.get_or_create(
            title=data['title'],
            defaults={
                'author': author,
                'category': data['category'],
                'content': data['content'],
                'status': 'published',
                'publish_date': timezone.now()
            }
        )
        if created:
            print(f"Created post: {data['title']}")
        else:
            print(f"Post already exists: {data['title']}")

    print("Blog seeding complete!")
