'use client';

import { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, MapPin, Users, Target, Search, Filter, X, Phone, DollarSign, Calendar, AlertCircle, CheckCircle, Lock, LogOut } from 'lucide-react';
import countyData from './data.json';

// Authentication credentials
const VALID_USERNAME = 'admin';
const VALID_PASSWORD = 'vyrite2025';

type County = {
  Rank: number;
  County: string;
  Tier: string;
  'Population 2024': number;
  'Growth Rate %': number;
  'Est DD Population': string;
  'CDDP Provider': string;
  'Provider Full Name': string;
  'Provider Phone': string;
  'Competition Level': string;
  'Opportunity Score': number;
  'Service Gap Score': number;
  'Unmet Need': string;
  'Wait List Status': string;
  'Market Entry Ease': string;
  'Licensing Complexity': string;
  'Investment Level': string;
  'Expected ROI Timeline': string;
  'Recommended Phase': string;
  'Recommended Service Model': string;
  'Profit Margin Potential': string;
  Notes: string;
};

const COLORS = {
  'TIER 1': '#10b981', // Green - Highest priority/best opportunity
  'TIER 2': '#3b82f6', // Blue - Secondary priority
  'TIER 3': '#8b5cf6', // Purple - Satellite markets
  'TIER 4': '#f59e0b', // Orange - Metro limited
};

// Login Component
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate a brief delay for UX
    setTimeout(() => {
      if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        localStorage.setItem('dd-dashboard-auth', 'true');
        onLogin();
      } else {
        setError('Invalid username or password');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <Lock className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Oregon I/DD Market</h1>
          <p className="text-slate-600 mt-2">Sign in to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-500">
            Oregon I/DD Market Analysis™ - VYRITE, LLC
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);
  const [selectedUnmetNeed, setSelectedUnmetNeed] = useState<string>('ALL');
  const [selectedCompetition, setSelectedCompetition] = useState<string>('ALL');
  const [selectedMarketEntry, setSelectedMarketEntry] = useState<string>('ALL');
  const [selectedStatCard, setSelectedStatCard] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('dd-dashboard-auth');
      setIsAuthenticated(auth === 'true');
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dd-dashboard-auth');
    }
    setIsAuthenticated(false);
  };

  // All useMemo hooks must be called before any conditional returns
  const filteredData = useMemo(() => {
    let data = countyData as County[];
    
    if (selectedTier !== 'ALL') {
      data = data.filter((county) => county.Tier === selectedTier);
    }
    
    if (selectedUnmetNeed !== 'ALL') {
      data = data.filter((county) => county['Unmet Need'] === selectedUnmetNeed);
    }
    
    if (selectedCompetition !== 'ALL') {
      data = data.filter((county) => county['Competition Level'] === selectedCompetition);
    }
    
    if (selectedMarketEntry !== 'ALL') {
      data = data.filter((county) => county['Market Entry Ease'] === selectedMarketEntry);
    }
    
    if (searchTerm) {
      data = data.filter((county) => 
        county.County.toLowerCase().includes(searchTerm.toLowerCase()) ||
        county['Provider Full Name'].toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return data;
  }, [selectedTier, searchTerm, selectedUnmetNeed, selectedCompetition, selectedMarketEntry]);

  const tierStats = useMemo(() => {
    const stats = {
      'TIER 1': 0,
      'TIER 2': 0,
      'TIER 3': 0,
      'TIER 4': 0,
    };
    
    (countyData as County[]).forEach((county) => {
      if (county.Tier in stats) {
        stats[county.Tier as keyof typeof stats]++;
      }
    });
    
    return Object.entries(stats).map(([tier, count]) => ({
      tier,
      count,
    }));
  }, []);

  const opportunityScoreData = useMemo(() => {
    return (countyData as County[])
      .slice(0, 10)
      .map((county) => ({
        county: county.County,
        score: county['Opportunity Score'],
        tier: county.Tier,
      }));
  }, []);

  const investmentData = useMemo(() => {
    const investments = (countyData as County[]).reduce((acc, county) => {
      const level = county['Investment Level'];
      if (!acc[level]) {
        acc[level] = {
          count: 0,
          counties: [],
        };
      }
      acc[level].count += 1;
      acc[level].counties.push(county.County);
      return acc;
    }, {} as Record<string, { count: number; counties: string[] }>);

    return Object.entries(investments).map(([level, data]) => ({
      level,
      count: data.count,
      counties: data.counties,
    }));
  }, []);

  const totalPopulation = useMemo(() => {
    return (countyData as County[]).reduce((sum, county) => sum + county['Population 2024'], 0);
  }, []);

  const avgOpportunityScore = useMemo(() => {
    const sum = (countyData as County[]).reduce((sum, county) => sum + county['Opportunity Score'], 0);
    return (sum / countyData.length).toFixed(1);
  }, []);

  const highPriorityCounties = useMemo(() => {
    return (countyData as County[]).filter(c => c.Tier === 'TIER 1').length;
  }, []);

  const totalCounties = countyData.length;

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Oregon I/DD Market</h1>
              <p className="text-slate-600 mt-1">Comprehensive analysis across Oregon</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                <Search className="w-4 h-4" />
                <span>Refresh Data</span>
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            onClick={() => setSelectedStatCard('totalCounties')}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 cursor-pointer hover:shadow-lg hover:border-violet-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Counties</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">{totalCounties}</h3>
                <p className="text-slate-500 text-xs mt-2">Analyzed markets</p>
              </div>
              <div className="bg-violet-100 p-3 rounded-xl">
                <MapPin className="w-6 h-6 text-violet-600" />
              </div>
            </div>
          </div>

          <div 
            onClick={() => setSelectedStatCard('totalPopulation')}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Population</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">{(totalPopulation / 1000000).toFixed(2)}M</h3>
                <p className="text-slate-500 text-xs mt-2">Across all counties</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div 
            onClick={() => setSelectedStatCard('avgOpportunity')}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 cursor-pointer hover:shadow-lg hover:border-emerald-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Avg Opportunity Score</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">{avgOpportunityScore}</h3>
                <p className="text-slate-500 text-xs mt-2">Out of 10</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-xl">
                <Target className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div 
            onClick={() => setSelectedStatCard('highPriority')}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 cursor-pointer hover:shadow-lg hover:border-green-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">High Priority Markets</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">{highPriorityCounties}</h3>
                <p className="text-slate-500 text-xs mt-2">Tier 1 counties</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Filters & Search</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Search Counties or Providers</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by county or provider name..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tier</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none text-slate-900"
                >
                  <option value="ALL">All Tiers</option>
                  <option value="TIER 1">Tier 1</option>
                  <option value="TIER 2">Tier 2</option>
                  <option value="TIER 3">Tier 3</option>
                  <option value="TIER 4">Tier 4</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Unmet Need</label>
              <select
                value={selectedUnmetNeed}
                onChange={(e) => setSelectedUnmetNeed(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900"
              >
                <option value="ALL">All Levels</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="MEDIUM-HIGH">Medium-High</option>
                <option value="MEDIUM-LOW">Medium-Low</option>
                <option value="LOW">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Competition</label>
              <select
                value={selectedCompetition}
                onChange={(e) => setSelectedCompetition(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900"
              >
                <option value="ALL">All Levels</option>
                <option value="VERY LOW">Very Low</option>
                <option value="LOW">Low</option>
                <option value="LOW-MOD">Low-Mod</option>
                <option value="MODERATE">Moderate</option>
                <option value="HIGH">High</option>
                <option value="VERY HIGH">Very High</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Market Entry</label>
              <select
                value={selectedMarketEntry}
                onChange={(e) => setSelectedMarketEntry(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900"
              >
                <option value="ALL">All Levels</option>
                <option value="EASY">Easy</option>
                <option value="EASY-MOD">Easy-Moderate</option>
                <option value="MODERATE">Moderate</option>
                <option value="HARD">Hard</option>
                <option value="VERY HARD">Very Hard</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedTier('ALL');
                  setSelectedUnmetNeed('ALL');
                  setSelectedCompetition('ALL');
                  setSelectedMarketEntry('ALL');
                  setSearchTerm('');
                }}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>

        {/* County Cards */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">County Rankings & Analysis</h2>
            <div className="text-sm text-slate-600">
              Showing {Math.min(9, filteredData.length)} of {filteredData.length} {filteredData.length !== totalCounties ? `filtered (${totalCounties} total)` : 'counties'}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.slice(0, 9).map((county) => (
              <div
                key={county.Rank}
                onClick={() => setSelectedCounty(county)}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all cursor-pointer hover:border-emerald-300"
                style={{ borderLeftWidth: '4px', borderLeftColor: COLORS[county.Tier as keyof typeof COLORS] }}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span 
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg"
                      style={{ 
                        backgroundColor: `${COLORS[county.Tier as keyof typeof COLORS]}20`,
                        color: COLORS[county.Tier as keyof typeof COLORS]
                      }}
                    >
                      {county.Rank}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{county.County}</h3>
                      <span 
                        className="inline-flex px-2 py-1 rounded-full text-xs font-medium mt-1"
                        style={{ 
                          backgroundColor: `${COLORS[county.Tier as keyof typeof COLORS]}20`,
                          color: COLORS[county.Tier as keyof typeof COLORS]
                        }}
                      >
                        {county.Tier}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Opportunity Score</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${(county['Opportunity Score'] / 10) * 100}%`,
                            backgroundColor: COLORS[county.Tier as keyof typeof COLORS]
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-900 min-w-[2ch]">{county['Opportunity Score']}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Population</span>
                    <span className="text-sm font-semibold text-slate-900">{county['Population 2024'].toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Est DD Pop</span>
                    <span className="text-sm font-semibold text-slate-900">{county['Est DD Population']}</span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                    county['Unmet Need'] === 'HIGH' ? 'bg-red-100 text-red-700' :
                    county['Unmet Need'] === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                    county['Unmet Need'] === 'MEDIUM-HIGH' ? 'bg-orange-100 text-orange-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {county['Unmet Need']} Need
                  </span>
                  <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                    county['Competition Level'] === 'LOW' || county['Competition Level'] === 'VERY LOW' ? 'bg-green-100 text-green-700' :
                    county['Competition Level'] === 'MODERATE' || county['Competition Level'] === 'LOW-MOD' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {county['Competition Level']} Competition
                  </span>
                </div>

                {/* Investment & ROI */}
                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Investment</span>
                    <span className="text-xs font-semibold text-slate-900">{county['Investment Level']}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">ROI Timeline</span>
                    <span className="text-xs font-semibold text-slate-900">{county['Expected ROI Timeline']}</span>
                  </div>
                </div>

                {/* View Details Indicator */}
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-xs text-center text-emerald-600 font-medium">Click to view full details →</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top 10 Opportunity Scores */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Top 10 Counties by Opportunity Score</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={opportunityScoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="county" stroke="#64748b" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  labelStyle={{ fontWeight: 'bold', color: '#334155' }}
                />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {opportunityScoreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.tier as keyof typeof COLORS] || '#8b5cf6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tier Distribution */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">County Distribution by Tier</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tierStats}
                  dataKey="count"
                  nameKey="tier"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {tierStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.tier as keyof typeof COLORS]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  formatter={(value: number, name: string) => [`${value} counties`, name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Investment Levels Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Investment Level Distribution</h2>
          <p className="text-slate-600 text-sm mb-4">Capital requirements by county - hover to see which counties need each investment level</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={investmentData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" />
              <YAxis type="category" dataKey="level" stroke="#64748b" width={150} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}
                labelStyle={{ fontWeight: 'bold', color: '#334155', marginBottom: '8px' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', maxWidth: '300px' }}>
                        <p style={{ fontWeight: 'bold', color: '#334155', marginBottom: '8px' }}>{data.level}</p>
                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>
                          <strong>{data.count}</strong> {data.count === 1 ? 'county' : 'counties'}
                        </p>
                        <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                          <p style={{ fontSize: '12px', color: '#475569', fontWeight: '600', marginBottom: '4px' }}>Counties:</p>
                          <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>
                            {data.counties.join(', ')}
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" fill="#10b981" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Card Info Modal */}
        {selectedStatCard && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedStatCard(null)}
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-slate-900">
                  {selectedStatCard === 'totalCounties' && 'Total Counties Analysis'}
                  {selectedStatCard === 'totalPopulation' && 'Population Overview'}
                  {selectedStatCard === 'avgOpportunity' && 'Opportunity Score Explained'}
                  {selectedStatCard === 'highPriority' && 'High Priority Markets'}
                </h2>
                <button
                  onClick={() => setSelectedStatCard(null)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {selectedStatCard === 'totalCounties' && (
                  <div className="space-y-6">
                    <div className="bg-violet-50 border border-violet-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-violet-100 p-3 rounded-xl">
                          <MapPin className="w-8 h-8 text-violet-600" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-slate-900">{totalCounties}</h3>
                          <p className="text-sm text-slate-600">Counties Analyzed</p>
                        </div>
                      </div>
                      <p className="text-slate-700">
                        Comprehensive analysis of all 36 counties across Oregon, covering the entire state&apos;s developmental disabilities service market.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-3">Market Coverage</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-2xl font-bold text-green-900">{(countyData as County[]).filter(c => c.Tier === 'TIER 1').length}</p>
                          <p className="text-sm text-slate-600">Tier 1 Counties</p>
                          <p className="text-xs text-slate-500 mt-1">Primary Anchors</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-2xl font-bold text-blue-900">{(countyData as County[]).filter(c => c.Tier === 'TIER 2').length}</p>
                          <p className="text-sm text-slate-600">Tier 2 Counties</p>
                          <p className="text-xs text-slate-500 mt-1">Secondary Markets</p>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <p className="text-2xl font-bold text-purple-900">{(countyData as County[]).filter(c => c.Tier === 'TIER 3').length}</p>
                          <p className="text-sm text-slate-600">Tier 3 Counties</p>
                          <p className="text-xs text-slate-500 mt-1">Satellite Markets</p>
                        </div>
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <p className="text-2xl font-bold text-orange-900">{(countyData as County[]).filter(c => c.Tier === 'TIER 4').length}</p>
                          <p className="text-sm text-slate-600">Tier 4 Counties</p>
                          <p className="text-xs text-slate-500 mt-1">Metro Limited</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4">
                      <h4 className="text-base font-bold text-slate-900 mb-2">Why This Matters</h4>
                      <ul className="space-y-2 text-sm text-slate-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                          <span><strong>Complete Coverage:</strong> Analysis covers 100% of Oregon counties for comprehensive market understanding</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                          <span><strong>Strategic Planning:</strong> Tiered classification helps prioritize market entry based on opportunity and resources</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                          <span><strong>Risk Assessment:</strong> Each county evaluated for competition, market entry ease, and profitability potential</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {selectedStatCard === 'totalPopulation' && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-blue-100 p-3 rounded-xl">
                          <Users className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-slate-900">{(totalPopulation / 1000000).toFixed(2)}M</h3>
                          <p className="text-sm text-slate-600">Total Population</p>
                        </div>
                      </div>
                      <p className="text-slate-700">
                        Combined population across all 36 Oregon counties, representing the total addressable market for developmental disabilities services.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-3">Population Breakdown</h4>
                      <div className="space-y-3">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold text-slate-900">Tier 1 Counties</p>
                            <p className="text-2xl font-bold text-green-900">
                              {((countyData as County[]).filter(c => c.Tier === 'TIER 1').reduce((sum, c) => sum + c['Population 2024'], 0) / 1000).toFixed(0)}K
                            </p>
                          </div>
                          <p className="text-xs text-slate-600">High-priority markets with best opportunity scores</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold text-slate-900">Tier 2 Counties</p>
                            <p className="text-2xl font-bold text-blue-900">
                              {((countyData as County[]).filter(c => c.Tier === 'TIER 2').reduce((sum, c) => sum + c['Population 2024'], 0) / 1000).toFixed(0)}K
                            </p>
                          </div>
                          <p className="text-xs text-slate-600">Secondary markets with solid growth potential</p>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold text-slate-900">Tier 3 Counties</p>
                            <p className="text-2xl font-bold text-purple-900">
                              {((countyData as County[]).filter(c => c.Tier === 'TIER 3').reduce((sum, c) => sum + c['Population 2024'], 0) / 1000).toFixed(0)}K
                            </p>
                          </div>
                          <p className="text-xs text-slate-600">Satellite markets for expansion</p>
                        </div>
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold text-slate-900">Tier 4 Counties</p>
                            <p className="text-2xl font-bold text-orange-900">
                              {((countyData as County[]).filter(c => c.Tier === 'TIER 4').reduce((sum, c) => sum + c['Population 2024'], 0) / 1000000).toFixed(2)}M
                            </p>
                          </div>
                          <p className="text-xs text-slate-600">Large metro areas with higher competition</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4">
                      <h4 className="text-base font-bold text-slate-900 mb-2">Key Insights</h4>
                      <ul className="space-y-2 text-sm text-slate-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                          <span><strong>Market Size:</strong> Estimated 1-1.5% of population needs DD services (44,000-66,000 individuals)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                          <span><strong>Growth Trends:</strong> Population growth correlates with increased service demand and revenue potential</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                          <span><strong>Service Density:</strong> Lower population counties often have higher unmet needs and less competition</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {selectedStatCard === 'avgOpportunity' && (
                  <div className="space-y-6">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-emerald-100 p-3 rounded-xl">
                          <Target className="w-8 h-8 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-slate-900">{avgOpportunityScore} / 10</h3>
                          <p className="text-sm text-slate-600">Average Opportunity Score</p>
                        </div>
                      </div>
                      <p className="text-slate-700">
                        The opportunity score represents the overall market attractiveness for DD service providers, considering multiple strategic factors.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-3">Scoring Criteria</h4>
                      <div className="space-y-3">
                        <div className="border border-slate-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-slate-900">Unmet Need Level</h5>
                            <span className="text-sm font-medium text-emerald-600">High Impact</span>
                          </div>
                          <p className="text-sm text-slate-600">Higher scores for markets with significant service gaps and wait lists</p>
                        </div>
                        <div className="border border-slate-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-slate-900">Competition Level</h5>
                            <span className="text-sm font-medium text-emerald-600">High Impact</span>
                          </div>
                          <p className="text-sm text-slate-600">Lower competition increases opportunity score and profit potential</p>
                        </div>
                        <div className="border border-slate-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-slate-900">Market Entry Ease</h5>
                            <span className="text-sm font-medium text-blue-600">Medium Impact</span>
                          </div>
                          <p className="text-sm text-slate-600">Considers licensing complexity, regulatory environment, and startup requirements</p>
                        </div>
                        <div className="border border-slate-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-slate-900">Population & Growth</h5>
                            <span className="text-sm font-medium text-blue-600">Medium Impact</span>
                          </div>
                          <p className="text-sm text-slate-600">Larger populations with positive growth trends score higher</p>
                        </div>
                        <div className="border border-slate-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-slate-900">ROI Potential</h5>
                            <span className="text-sm font-medium text-purple-600">Supporting Factor</span>
                          </div>
                          <p className="text-sm text-slate-600">Expected return on investment and profit margin considerations</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4">
                      <h4 className="text-base font-bold text-slate-900 mb-2">How to Use This Score</h4>
                      <ul className="space-y-2 text-sm text-slate-700">
                        <li className="flex items-start gap-2">
                          <Target className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <span><strong>8.0-10:</strong> Excellent opportunities - High priority for immediate market entry</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Target className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <span><strong>6.0-7.9:</strong> Good opportunities - Strong potential for Phase 2-3 expansion</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Target className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                          <span><strong>4.0-5.9:</strong> Moderate opportunities - Consider for specialized niches or later phases</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Target className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                          <span><strong>Below 4.0:</strong> Challenging markets - High competition or limited growth potential</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {selectedStatCard === 'highPriority' && (
                  <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-green-100 p-3 rounded-xl">
                          <TrendingUp className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-slate-900">{highPriorityCounties}</h3>
                          <p className="text-sm text-slate-600">Tier 1 Counties</p>
                        </div>
                      </div>
                      <p className="text-slate-700">
                        These counties represent the highest-priority markets with optimal conditions for DD service providers to establish and grow operations.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-3">Tier 1 Counties</h4>
                      <div className="space-y-2">
                        {(countyData as County[]).filter(c => c.Tier === 'TIER 1').map((county) => (
                          <div 
                            key={county.Rank}
                            onClick={() => {
                              setSelectedStatCard(null);
                              setSelectedCounty(county);
                            }}
                            className="border border-green-200 bg-green-50 rounded-lg p-4 hover:bg-green-100 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-200 text-green-900 font-bold text-sm">
                        {county.Rank}
                                </span>
                                <h5 className="font-bold text-slate-900">{county.County} County</h5>
                              </div>
                              <span className="text-lg font-bold text-green-900">{county['Opportunity Score']}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-slate-600">Population</p>
                                <p className="font-semibold text-slate-900">{county['Population 2024'].toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-slate-600">Investment</p>
                                <p className="font-semibold text-slate-900">{county['Investment Level']}</p>
                              </div>
                              <div>
                                <p className="text-slate-600">Competition</p>
                                <p className="font-semibold text-slate-900">{county['Competition Level']}</p>
                              </div>
                              <div>
                                <p className="text-slate-600">ROI Timeline</p>
                                <p className="font-semibold text-slate-900">{county['Expected ROI Timeline']}</p>
                              </div>
                            </div>
                            <p className="text-xs text-green-600 mt-2">Click to view full details →</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4">
                      <h4 className="text-base font-bold text-slate-900 mb-2">Why Focus on Tier 1?</h4>
                      <ul className="space-y-2 text-sm text-slate-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                          <span><strong>Highest Opportunity Scores:</strong> Best combination of market need, low competition, and growth potential</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                          <span><strong>Faster ROI:</strong> Typically break even within 12-24 months with strong profit margins</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                          <span><strong>Strategic Anchors:</strong> Establish strong market presence before expanding to adjacent counties</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                          <span><strong>Lower Risk:</strong> Easier market entry with less regulatory complexity and competition</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* County Details Modal */}
        {selectedCounty && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCounty(null)}
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div 
                className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10"
                style={{ borderLeftWidth: '6px', borderLeftColor: COLORS[selectedCounty.Tier as keyof typeof COLORS] }}
              >
                <div className="flex items-center gap-4">
                  <span 
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-xl"
                    style={{ 
                      backgroundColor: `${COLORS[selectedCounty.Tier as keyof typeof COLORS]}20`,
                      color: COLORS[selectedCounty.Tier as keyof typeof COLORS]
                    }}
                  >
                    {selectedCounty.Rank}
                      </span>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{selectedCounty.County} County</h2>
                      <span 
                      className="inline-flex px-3 py-1 rounded-full text-sm font-medium mt-1"
                        style={{ 
                        backgroundColor: `${COLORS[selectedCounty.Tier as keyof typeof COLORS]}20`,
                        color: COLORS[selectedCounty.Tier as keyof typeof COLORS]
                        }}
                      >
                      {selectedCounty.Tier}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCounty(null)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Executive Summary */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 mb-6 text-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-300 mb-2">Executive Summary</h3>
                      <p className="text-white text-sm leading-relaxed">
                        {selectedCounty.County} County is a <strong>{selectedCounty.Tier.replace('TIER ', 'Tier ')}</strong> market 
                        with {selectedCounty['Unmet Need'].toLowerCase()} unmet need and {selectedCounty['Competition Level'].toLowerCase()} competition. 
                        With a population of {selectedCounty['Population 2024'].toLocaleString()} and an estimated DD population of {selectedCounty['Est DD Population']}, 
                        this market presents a {selectedCounty['Opportunity Score'] >= 8 ? 'strong' : selectedCounty['Opportunity Score'] >= 6 ? 'moderate' : 'developing'} opportunity 
                        for service expansion. Recommended entry via {selectedCounty['Recommended Service Model'].toLowerCase()}.
                      </p>
                    </div>
                    <div className="ml-6 text-center">
                      <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center border-4 border-emerald-400">
                        <span className="text-3xl font-bold text-emerald-400">{selectedCounty['Opportunity Score']}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2">Overall Score</p>
                    </div>
                  </div>
                  
                  {/* Key Highlights */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-700">
                    <div>
                      <p className="text-slate-400 text-xs">Market Rank</p>
                      <p className="text-white font-bold text-lg">#{selectedCounty.Rank} of 36</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Service Gap</p>
                      <p className="text-white font-bold text-lg">{selectedCounty['Service Gap Score']}/10</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Entry Difficulty</p>
                      <p className="text-white font-bold text-lg">{selectedCounty['Market Entry Ease']}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Profit Potential</p>
                      <p className="text-white font-bold text-lg">{selectedCounty['Profit Margin Potential']}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-900">Opportunity</span>
                    </div>
                    <p className="text-3xl font-bold text-emerald-900">{selectedCounty['Opportunity Score']}</p>
                    <p className="text-xs text-emerald-700 mt-1">out of 10</p>
                    <div className="mt-2 h-1.5 bg-emerald-200 rounded-full">
                      <div className="h-1.5 bg-emerald-600 rounded-full" style={{ width: `${selectedCounty['Opportunity Score'] * 10}%` }} />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Population</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-900">{selectedCounty['Population 2024'].toLocaleString()}</p>
                    <p className="text-xs text-blue-700 mt-1">
                      <span className={selectedCounty['Growth Rate %'] > 0 ? 'text-green-600' : 'text-red-600'}>
                        {selectedCounty['Growth Rate %'] > 0 ? '+' : ''}{selectedCounty['Growth Rate %']}% growth
                      </span>
                    </p>
                    <p className="text-xs text-blue-600 mt-1">DD Est: {selectedCounty['Est DD Population']}</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">Investment</span>
                    </div>
                    <p className="text-lg font-bold text-purple-900">{selectedCounty['Investment Level']}</p>
                    <p className="text-xs text-purple-700 mt-1">{selectedCounty['Profit Margin Potential']} margin</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-orange-600" />
                      <span className="text-sm font-medium text-orange-900">ROI Timeline</span>
                    </div>
                    <p className="text-lg font-bold text-orange-900">{selectedCounty['Expected ROI Timeline']}</p>
                    <p className="text-xs text-orange-700 mt-1">{selectedCounty['Recommended Phase']}</p>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    Risk & Opportunity Assessment
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Strengths */}
                    <div>
                      <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Strengths
                      </h4>
                      <ul className="space-y-2 text-sm text-slate-700">
                        {selectedCounty['Competition Level'] === 'LOW' || selectedCounty['Competition Level'] === 'VERY LOW' ? (
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">•</span>
                            Low competitive pressure
                          </li>
                        ) : null}
                        {selectedCounty['Unmet Need'] === 'HIGH' || selectedCounty['Unmet Need'] === 'MEDIUM-HIGH' ? (
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">•</span>
                            High service demand
                          </li>
                        ) : null}
                        {selectedCounty['Market Entry Ease'] === 'EASY' || selectedCounty['Market Entry Ease'] === 'EASY-MOD' ? (
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">•</span>
                            Easy market entry
                          </li>
                        ) : null}
                        {selectedCounty['Profit Margin Potential'] === 'HIGH' || selectedCounty['Profit Margin Potential'] === 'MODERATE-HIGH' ? (
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">•</span>
                            Strong profit potential
                          </li>
                        ) : null}
                        {selectedCounty['Opportunity Score'] >= 7 ? (
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">•</span>
                            Above-average opportunity score
                          </li>
                        ) : null}
                      </ul>
                    </div>
                    
                    {/* Challenges */}
                    <div>
                      <h4 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> Challenges
                      </h4>
                      <ul className="space-y-2 text-sm text-slate-700">
                        {selectedCounty['Growth Rate %'] < 0 ? (
                          <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            Declining population ({selectedCounty['Growth Rate %']}%)
                          </li>
                        ) : null}
                        {selectedCounty['Competition Level'] === 'HIGH' || selectedCounty['Competition Level'] === 'VERY HIGH' ? (
                          <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            High competition
                          </li>
                        ) : null}
                        {selectedCounty['Licensing Complexity'] === 'HARD' || selectedCounty['Licensing Complexity'] === 'VERY HARD' ? (
                          <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            Complex licensing requirements
                          </li>
                        ) : null}
                        {selectedCounty['Population 2024'] < 20000 ? (
                          <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            Small population base
                          </li>
                        ) : null}
                        {selectedCounty['Investment Level'].includes('1M') || selectedCounty['Investment Level'].includes('800K') ? (
                          <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            Higher capital requirements
                          </li>
                        ) : null}
                      </ul>
                    </div>
                    
                    {/* Key Actions */}
                    <div>
                      <h4 className="text-sm font-semibold text-blue-700 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Key Actions
                      </h4>
                      <ul className="space-y-2 text-sm text-slate-700">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">1.</span>
                          Contact {selectedCounty['CDDP Provider']} CDDP
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">2.</span>
                          Assess local facility availability
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">3.</span>
                          Begin licensing process ({selectedCounty['Licensing Complexity'].toLowerCase()})
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">4.</span>
                          Build {selectedCounty['Recommended Service Model'].split('+')[0].trim().toLowerCase()}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Provider Information */}
                <div className="bg-slate-50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    CDDP Provider Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Provider Name</p>
                      <p className="text-base font-semibold text-slate-900">{selectedCounty['Provider Full Name']}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Contact Phone</p>
                      <a 
                        href={`tel:${selectedCounty['Provider Phone']}`}
                        className="text-base font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        {selectedCounty['Provider Phone']}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Detailed Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Demographics */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                    <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-emerald-600" />
                      Demographics
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Population 2024</p>
                        <p className="text-lg font-semibold text-slate-900">{selectedCounty['Population 2024'].toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Growth Rate</p>
                        <p className={`text-lg font-semibold ${selectedCounty['Growth Rate %'] > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedCounty['Growth Rate %'] > 0 ? '+' : ''}{selectedCounty['Growth Rate %']}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Est DD Population</p>
                        <p className="text-lg font-semibold text-slate-900">{selectedCounty['Est DD Population']}</p>
                      </div>
                    </div>
                  </div>

                  {/* Market Analysis */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                    <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-emerald-600" />
                      Market Analysis
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Opportunity Score</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full" 
                              style={{ 
                                width: `${(selectedCounty['Opportunity Score'] / 10) * 100}%`,
                                backgroundColor: COLORS[selectedCounty.Tier as keyof typeof COLORS]
                              }}
                            />
                          </div>
                          <span className="text-lg font-bold text-slate-900">{selectedCounty['Opportunity Score']}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Service Gap Score</p>
                      <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div 
                              className="h-2 rounded-full bg-blue-500" 
                              style={{ width: `${(selectedCounty['Service Gap Score'] / 10) * 100}%` }}
                          />
                          </div>
                          <span className="text-lg font-bold text-slate-900">{selectedCounty['Service Gap Score']}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Unmet Need</p>
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          selectedCounty['Unmet Need'] === 'HIGH' ? 'bg-red-100 text-red-700' :
                          selectedCounty['Unmet Need'] === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                          selectedCounty['Unmet Need'] === 'MEDIUM-HIGH' ? 'bg-orange-100 text-orange-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {selectedCounty['Unmet Need']}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Wait List Status</p>
                        <p className="text-sm font-semibold text-slate-900">{selectedCounty['Wait List Status']}</p>
                      </div>
                    </div>
                  </div>

                  {/* Competition & Entry */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                    <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-emerald-600" />
                      Competition & Entry
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Competition Level</p>
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          selectedCounty['Competition Level'] === 'LOW' || selectedCounty['Competition Level'] === 'VERY LOW' ? 'bg-green-100 text-green-700' :
                          selectedCounty['Competition Level'] === 'MODERATE' || selectedCounty['Competition Level'] === 'LOW-MOD' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {selectedCounty['Competition Level']}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Market Entry Ease</p>
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          selectedCounty['Market Entry Ease'] === 'EASY' || selectedCounty['Market Entry Ease'] === 'EASY-MOD' ? 'bg-green-100 text-green-700' :
                          selectedCounty['Market Entry Ease'] === 'MODERATE' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {selectedCounty['Market Entry Ease']}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Licensing Complexity</p>
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          selectedCounty['Licensing Complexity'] === 'EASY' || selectedCounty['Licensing Complexity'] === 'EASY-MOD' ? 'bg-green-100 text-green-700' :
                          selectedCounty['Licensing Complexity'] === 'MODERATE' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                          {selectedCounty['Licensing Complexity']}
                      </span>
                      </div>
                    </div>
                  </div>

                  {/* Financial */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                    <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                      Financial
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Investment Level</p>
                        <p className="text-lg font-semibold text-slate-900">{selectedCounty['Investment Level']}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Expected ROI Timeline</p>
                        <p className="text-sm font-semibold text-slate-900">{selectedCounty['Expected ROI Timeline']}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Profit Margin Potential</p>
                        <p className="text-sm font-semibold text-slate-900">{selectedCounty['Profit Margin Potential']}</p>
                      </div>
                    </div>
                  </div>

                  {/* Strategy */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 md:col-span-2">
                    <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      Strategy & Recommendations
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Recommended Phase</p>
                          <p className="text-sm font-semibold text-slate-900">{selectedCounty['Recommended Phase']}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Recommended Service Model</p>
                          <p className="text-sm text-slate-700">{selectedCounty['Recommended Service Model']}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Investment Required</p>
                          <p className="text-sm font-semibold text-slate-900">{selectedCounty['Investment Level']}</p>
                        </div>
                      </div>
                      <div className="bg-emerald-50 rounded-lg p-4">
                        <p className="text-xs font-semibold text-emerald-800 mb-2">Implementation Timeline</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-xs text-slate-700">Month 1-3: Site assessment & licensing</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                            <span className="text-xs text-slate-700">Month 3-6: Facility setup & staffing</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-300"></div>
                            <span className="text-xs text-slate-700">Month 6-12: Operations launch</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                            <span className="text-xs text-slate-700">{selectedCounty['Expected ROI Timeline']}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Market Comparison */}
                <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Market Comparison (vs. Oregon Average)
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">Opportunity Score</p>
                      <p className="text-2xl font-bold text-slate-900">{selectedCounty['Opportunity Score']}</p>
                      <p className={`text-xs mt-1 ${selectedCounty['Opportunity Score'] >= 6.5 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedCounty['Opportunity Score'] >= 6.5 ? '↑' : '↓'} vs avg 6.5
                      </p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">Service Gap</p>
                      <p className="text-2xl font-bold text-slate-900">{selectedCounty['Service Gap Score']}</p>
                      <p className={`text-xs mt-1 ${selectedCounty['Service Gap Score'] >= 6.0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedCounty['Service Gap Score'] >= 6.0 ? '↑' : '↓'} vs avg 6.0
                      </p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">Population</p>
                      <p className="text-2xl font-bold text-slate-900">{(selectedCounty['Population 2024'] / 1000).toFixed(0)}K</p>
                      <p className={`text-xs mt-1 ${selectedCounty['Population 2024'] >= 120000 ? 'text-green-600' : 'text-slate-500'}`}>
                        {selectedCounty['Population 2024'] >= 120000 ? '↑ Above' : '↓ Below'} avg
                      </p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">Growth Rate</p>
                      <p className="text-2xl font-bold text-slate-900">{selectedCounty['Growth Rate %']}%</p>
                      <p className={`text-xs mt-1 ${selectedCounty['Growth Rate %'] >= 0.5 ? 'text-green-600' : selectedCounty['Growth Rate %'] < 0 ? 'text-red-600' : 'text-slate-500'}`}>
                        {selectedCounty['Growth Rate %'] >= 0.5 ? '↑ Growing' : selectedCounty['Growth Rate %'] < 0 ? '↓ Declining' : '→ Stable'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedCounty.Notes && (
                  <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-6">
                    <h4 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                      Strategic Notes
                    </h4>
                    <p className="text-sm text-slate-700">{selectedCounty.Notes}</p>
                  </div>
                )}

                {/* Contact CTA */}
                <div className="mt-6 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-6 text-white">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-bold">Ready to enter {selectedCounty.County} County?</h4>
                      <p className="text-emerald-100 text-sm mt-1">Contact the local CDDP to begin your market assessment</p>
                    </div>
                    <a 
                      href={`tel:${selectedCounty['Provider Phone'].split('/')[0].trim()}`}
                      className="inline-flex items-center gap-2 bg-white text-emerald-700 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      Call {selectedCounty['CDDP Provider'].split('/')[0].trim()}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-600">
              <p>&copy; 2025 VYRITE LLC. All rights reserved.</p>
            </div>
            <div className="text-sm text-slate-500">
              <p>Oregon I/DD Market Analysis™ is a trademark of VYRITE, LLC</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
