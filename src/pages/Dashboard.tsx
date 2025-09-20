import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  TrendingUp, 
  Users, 
  Truck, 
  MessageSquare,
  DollarSign,
  ArrowRight,
  Sprout,
  Package,
  Calculator,
  TrendingDown
} from "lucide-react";
import { Link } from "react-router-dom";

// This will be moved inside the component to use translations

// These will be moved inside the component to use translations

export default function Dashboard() {
  const { t } = useLanguage();
  
  const stats = [
    {
      title: t('dashboard.stats.totalExpenses'),
      value: "₹45,320",
      icon: Calculator,
      trend: { value: t('dashboard.stats.expensesTrend'), positive: false }
    },
    {
      title: t('dashboard.stats.activeLoans'),
      value: "3",
      icon: DollarSign,
      trend: { value: t('dashboard.stats.loansTrend'), positive: true }
    },
    {
      title: t('dashboard.stats.equipmentBookings'),
      value: "8",
      icon: Truck,
      trend: { value: t('dashboard.stats.equipmentTrend'), positive: true }
    },
    {
      title: t('dashboard.stats.forumPosts'),
      value: "24",
      icon: MessageSquare,
      trend: { value: t('dashboard.stats.forumTrend'), positive: true }
    }
  ];

  const quickActions = [
    {
      title: t('dashboard.actions.bookEquipment'),
      description: t('dashboard.actions.bookEquipmentDesc'),
      icon: Truck,
      href: "/equipment",
      color: "bg-gradient-primary"
    },
    {
      title: t('dashboard.actions.trackExpenses'),
      description: t('dashboard.actions.trackExpensesDesc'),
      icon: Calculator,
      href: "/expenses",
      color: "bg-gradient-secondary"
    },
    {
      title: t('dashboard.actions.joinForum'),
      description: t('dashboard.actions.joinForumDesc'),
      icon: MessageSquare,
      href: "/forum",
      color: "bg-gradient-primary"
    },
    {
      title: t('dashboard.actions.viewSchemes'),
      description: t('dashboard.actions.viewSchemesDesc'),
      icon: TrendingUp,
      href: "/insights",
      color: "bg-gradient-secondary"
    }
  ];

  const recentActivity = [
    {
      title: t('dashboard.activity.tractorBooked'),
      time: `2 ${t('dashboard.activity.hoursAgo')}`,
      icon: Truck,
      type: "success"
    },
    {
      title: t('dashboard.activity.loanApproved'),
      time: `1 ${t('dashboard.activity.dayAgo')}`,
      icon: DollarSign,
      type: "success"
    },
    {
      title: t('dashboard.activity.forumReply'),
      time: `2 ${t('dashboard.activity.daysAgo')}`,
      icon: MessageSquare,
      type: "info"
    },
    {
      title: t('dashboard.activity.fertilizerOrder'),
      time: `3 ${t('dashboard.activity.daysAgo')}`,
      icon: Package,
      type: "success"
    }
  ];
  
  return (
    <div className="relative min-h-screen">
      {/* Full Page Background */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/wp9212222.jpg" 
          alt="Farm background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 space-y-8 p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-hero rounded-2xl p-8 text-white shadow-glow">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('dashboard.title')}</h1>
            <p className="text-lg opacity-90">
              {t('dashboard.subtitle')}
            </p>
          </div>
          <div className="hidden md:block">
            <Sprout className="h-20 w-20 opacity-20" />
          </div>
        </div>
      </div>

      {/* Promotional Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Equipment Card */}
        <Link to="/equipment">
          <Card className="relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Truck className="h-8 w-8" />
                </div>
                <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                  {t('dashboard.premium')}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{t('dashboard.equipment.title')}</h3>
              <p className="text-green-100 mb-4">{t('dashboard.equipment.subtitle')}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{t('dashboard.fromPrice')}</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Loans Card */}
        <Link to="/lending">
          <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <DollarSign className="h-8 w-8" />
                </div>
                <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                  {t('dashboard.instant')}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{t('dashboard.lending.title')}</h3>
              <p className="text-yellow-100 mb-4">{t('dashboard.lending.subtitle')}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{t('dashboard.upToPrice')}</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Seeds & Fertilizers Card */}
        <Link to="/orders">
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Sprout className="h-8 w-8" />
                </div>
                <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                  {t('dashboard.organic')}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{t('dashboard.schemes.title')}</h3>
              <p className="text-blue-100 mb-4">{t('dashboard.schemes.subtitle')}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{t('dashboard.upToOff')}</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Market Insights Card */}
        <Link to="/insights">
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                  {t('dashboard.smart')}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{t('dashboard.insights.title')}</h3>
              <p className="text-purple-100 mb-4">{t('dashboard.insights.subtitle')}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{t('dashboard.liveData')}</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Community Forum Card */}
        <Link to="/forum">
          <Card className="relative overflow-hidden bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                  {t('dashboard.active')}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{t('dashboard.forum.title')}</h3>
              <p className="text-teal-100 mb-4">{t('dashboard.forum.subtitle')}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{t('dashboard.members')}</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Insurance Card */}
        <Link to="/banking">
          <Card className="relative overflow-hidden bg-gradient-to-br from-red-500 to-red-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Package className="h-8 w-8" />
                </div>
                <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                  {t('dashboard.secure')}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{t('dashboard.banking.title')}</h3>
              <p className="text-red-100 mb-4">{t('dashboard.banking.subtitle')}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{t('dashboard.insurancePrice')}</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            className="animate-bounce-in"
            style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            {t('dashboard.quickActions.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.title} to={action.href}>
                <Card className="hover:shadow-hover transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className={`${action.color} p-3 rounded-lg w-fit mx-auto mb-4 group-hover:shadow-glow transition-all duration-300`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                    <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {t('dashboard.getStarted')}
                      <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            {t('dashboard.recentActivity.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'success' ? 'bg-agricultural-green text-white' :
                  activity.type === 'info' ? 'bg-agricultural-gold text-white' :
                  'bg-muted text-muted-foreground'
                }`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}