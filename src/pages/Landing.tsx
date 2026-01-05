import { Link } from 'react-router-dom';
import { Heart, Calendar, Users, FileText, Activity, Shield, ArrowRight, CheckCircle, Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Users,
    title: 'Patient Management',
    description: 'Comprehensive patient profiles with medical history, allergies, and conditions tracking.',
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Intelligent appointment booking with conflict detection and real-time availability.',
  },
  {
    icon: Activity,
    title: 'Vitals Tracking',
    description: 'Interactive charts for blood pressure, heart rate, weight, and temperature trends.',
  },
  {
    icon: FileText,
    title: 'Medical Records',
    description: 'Centralized medical logs with secure storage and provider attribution.',
  },
  {
    icon: Shield,
    title: 'HIPAA Compliant',
    description: 'Enterprise-grade security with role-based access control and data encryption.',
  },
  {
    icon: Activity,
    title: 'Real-time Updates',
    description: 'Instant notifications and live updates for appointment status changes.',
  },
];

const benefits = [
  'Reduce administrative workload by 40%',
  'Improve patient satisfaction scores',
  'Streamline care coordination',
  'Access records from anywhere',
  'Automated appointment reminders',
  'Comprehensive analytics dashboard',
];

const pricingPlans = [
  {
    name: 'Starter',
    price: '49',
    description: 'Perfect for solo practitioners and small clinics',
    features: [
      'Up to 100 patients',
      'Basic appointment scheduling',
      'Patient records management',
      'Email support',
      '5 GB storage',
    ],
    popular: false,
  },
  {
    name: 'Professional',
    price: '99',
    description: 'Ideal for growing practices with multiple providers',
    features: [
      'Up to 500 patients',
      'Advanced scheduling with conflict detection',
      'Vitals tracking & analytics',
      'Real-time updates',
      'Priority support',
      '25 GB storage',
      'Custom reports',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '249',
    description: 'For large healthcare organizations',
    features: [
      'Unlimited patients',
      'Multi-location support',
      'Advanced analytics dashboard',
      'API access',
      'Dedicated account manager',
      'Unlimited storage',
      'Custom integrations',
      'SSO & advanced security',
    ],
    popular: false,
  },
];

const testimonials = [
  {
    quote: "CareLink has transformed how we manage our practice. The scheduling system alone has saved us hours every week.",
    author: 'Dr. Sarah Mitchell',
    role: 'Family Medicine Physician',
    clinic: 'Riverside Family Clinic',
    rating: 5,
  },
  {
    quote: "The vitals tracking feature gives me instant insight into patient trends. It's become an essential part of our care workflow.",
    author: 'Dr. James Chen',
    role: 'Internal Medicine',
    clinic: 'Metro Health Partners',
    rating: 5,
  },
  {
    quote: "Finally, a system that our entire staff actually enjoys using. The interface is intuitive and the support team is exceptional.",
    author: 'Amanda Rodriguez, RN',
    role: 'Practice Manager',
    clinic: 'Coastal Wellness Center',
    rating: 5,
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">CareLink</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/auth">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Shield className="h-4 w-4" />
            HIPAA Compliant Healthcare Platform
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Healthcare Management
            <br />
            <span className="text-primary">Simplified</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            CareLink Systems provides a comprehensive platform for managing patients, 
            appointments, and medical records with enterprise-grade security.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" className="gap-2 text-lg px-8">
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete suite of tools designed for modern healthcare practices.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your practice. All plans include a 14-day free trial.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-card rounded-2xl p-8 border ${
                  plan.popular 
                    ? 'border-primary shadow-lg shadow-primary/10 scale-105' 
                    : 'border-border'
                } transition-all hover:shadow-lg`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-sm font-medium px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-foreground text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/auth" className="block">
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Trusted by Healthcare Providers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what medical professionals are saying about CareLink Systems.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-8 border border-border relative"
              >
                <Quote className="h-10 w-10 text-primary/20 absolute top-6 right-6" />
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-sm text-primary">{testimonial.clinic}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Transform Your Practice
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of healthcare providers who have streamlined their 
                operations with CareLink Systems.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl p-8 lg:p-12">
              <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Live Dashboard</p>
                    <p className="text-sm text-muted-foreground">Real-time analytics</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Patients Today</span>
                    <span className="font-semibold text-foreground">24</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-primary rounded-full" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Appointments</span>
                    <span className="font-semibold text-foreground">18/24</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-10">
            Join CareLink Systems today and experience the future of healthcare management.
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="text-lg px-8 gap-2">
              Create Free Account
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Heart className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">CareLink Systems</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 CareLink Systems. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
