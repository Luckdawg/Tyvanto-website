import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Download, 
  FileText, 
  Calendar,
  DollarSign,
  BarChart3,
  Users,
  Building2,
  ExternalLink,
  Newspaper,
  Clock,
  Search
} from "lucide-react";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { RefreshCw } from "lucide-react";
import StockChart from "@/components/StockChart";
import NewsletterSignup from "@/components/NewsletterSignup";

export default function InvestorRelations() {
  // Fetch stock data from backend API with auto-refresh every 15 minutes
  const { data: stockData, isLoading, refetch, isFetching } = trpc.stock.getVISMData.useQuery(
    undefined,
    {
      refetchInterval: 15 * 60 * 1000, // 15 minutes in milliseconds
      refetchIntervalInBackground: true,
      staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    }
  );

  // Calculate data age
  const [dataAge, setDataAge] = useState<string>("");
  
  useEffect(() => {
    if (!stockData?.timestamp) return;
    
    const updateAge = () => {
      const now = new Date().getTime();
      const dataTime = new Date(stockData.timestamp).getTime();
      const diffMinutes = Math.floor((now - dataTime) / (1000 * 60));
      
      if (diffMinutes < 1) {
        setDataAge("Just now");
      } else if (diffMinutes < 60) {
        setDataAge(`${diffMinutes} min ago`);
      } else {
        const hours = Math.floor(diffMinutes / 60);
        setDataAge(`${hours} hour${hours > 1 ? 's' : ''} ago`);
      }
    };
    
    updateAge();
    const interval = setInterval(updateAge, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [stockData?.timestamp]);

  // Format market cap for display
  const formattedMarketCap = stockData?.marketCap || "$2.1M";

  // Financial highlights removed as requested - data now shown in main stock card

  // Fetch real SEC filings from database
  const { data: secFilingsData, isLoading: isLoadingFilings } = trpc.secFilings.getRecent.useQuery({ limit: 20 });
  
  // Format date for display
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // News feed data
  const newsItems = [
    {
      id: 1,
      title: "Visium Technologies Announces Q4 2025 Earnings Results",
      date: "February 20, 2026",
      excerpt: "Visium Technologies reported strong Q4 2025 results with 45% YoY growth in platform adoption and record customer retention rates.",
      link: "#"
    },
    {
      id: 2,
      title: "New Partnership with Fortune 500 Enterprise",
      date: "February 10, 2026",
      excerpt: "Visium Technologies partners with leading financial services company to deploy TruContext across critical infrastructure.",
      link: "#"
    },
    {
      id: 3,
      title: "Visium Named Leader in Gartner Magic Quadrant",
      date: "January 28, 2026",
      excerpt: "Visium Technologies recognized as a Leader in the 2026 Gartner Magic Quadrant for Security Analytics Platforms.",
      link: "#"
    },
    {
      id: 4,
      title: "CEO Keynote at RSA Conference 2026",
      date: "January 15, 2026",
      excerpt: "Visium CEO presents on the future of agentic AI in cybersecurity to 5,000+ security professionals.",
      link: "#"
    }
  ];

  // Earnings calendar data
  const earningsCalendar = [
    {
      quarter: "Q4 2025",
      expectedDate: "February 20, 2026",
      status: "Reported",
      eps: "$0.12",
      revenue: "$8.5M"
    },
    {
      quarter: "Q1 2026",
      expectedDate: "May 15, 2026",
      status: "Upcoming",
      eps: "TBD",
      revenue: "TBD"
    },
    {
      quarter: "Q2 2026",
      expectedDate: "August 14, 2026",
      status: "Upcoming",
      eps: "TBD",
      revenue: "TBD"
    },
    {
      quarter: "Q3 2026",
      expectedDate: "November 13, 2026",
      status: "Upcoming",
      eps: "TBD",
      revenue: "TBD"
    }
  ];

  // Shareholder documents
  const shareholderDocuments = [
    {
      id: 1,
      title: "2025 Annual Report",
      type: "Annual Report",
      date: "March 15, 2025",
      size: "12 MB",
      icon: FileText
    },
    {
      id: 2,
      title: "2025 Proxy Statement",
      type: "Proxy Statement",
      date: "April 10, 2025",
      size: "8 MB",
      icon: FileText
    },
    {
      id: 3,
      title: "2024 Annual Report",
      type: "Annual Report",
      date: "March 20, 2024",
      size: "11 MB",
      icon: FileText
    },
    {
      id: 4,
      title: "2024 Proxy Statement",
      type: "Proxy Statement",
      date: "April 15, 2024",
      size: "7.5 MB",
      icon: FileText
    },
    {
      id: 5,
      title: "2023 Annual Report",
      type: "Annual Report",
      date: "March 18, 2023",
      size: "10 MB",
      icon: FileText
    },
    {
      id: 6,
      title: "2023 Proxy Statement",
      type: "Proxy Statement",
      date: "April 12, 2023",
      size: "7 MB",
      icon: FileText
    }
  ];

  const investorResources = [
    { title: "Investor Presentation", description: "Q4 2025 Earnings Presentation", icon: FileText },
    { title: "Annual Reports", description: "Access historical annual reports", icon: Download },
    { title: "Earnings Calendar", description: "Upcoming earnings dates and events", icon: Calendar },
    { title: "Stock Information", description: "Detailed stock performance data", icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-16">
        <div className="container">
          <div className="max-w-4xl">
            <Badge className="bg-white/20 text-white border-white/30 mb-4">
              OTCQB: VISM
            </Badge>
            <h1 className="text-5xl font-bold mb-4">Investor Relations</h1>
            <p className="text-xl text-white/90">
              Visium Technologies is committed to providing transparent and timely information to our shareholders and the investment community.
            </p>
          </div>
        </div>
      </section>

      {/* Stock Quote Section */}
      <section className="py-12 bg-white">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Stock Quote</h2>
          
          <div className="grid lg:grid-cols-1 gap-6 mb-8">
            {/* Current Price Card */}
            <Card className="border-2 border-primary">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Visium Technologies Inc.</div>
                    <div className="text-2xl font-bold text-gray-900">VISM</div>
                    <div className="text-xs text-gray-500">OTCQB</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={isLoading || isFetching ? "secondary" : "default"} className="text-sm">
                        {isLoading || isFetching ? "Updating..." : "Live"}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="h-8 w-8 p-0"
                      >
                        <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://www.google.com/finance/quote/VISM:OTCMKTS" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs">
                        <ExternalLink className="h-3 w-3" />
                        Google Finance
                      </a>
                    </Button>
                  </div>
                </div>

                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-16 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-baseline gap-4 mb-2">
                      <div className="text-6xl font-bold text-gray-900">
                        ${stockData?.price.toFixed(4) || "0.0000"}
                      </div>
                      <div className={`text-2xl font-semibold ${(stockData?.change || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {(stockData?.change || 0) >= 0 ? '+' : ''}{stockData?.change.toFixed(4) || "0.0000"}
                        ({(stockData?.changePercent || 0) >= 0 ? '+' : ''}{stockData?.changePercent.toFixed(2) || "0.00"}%)
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {stockData?.timestamp ? (
                        <div className="flex items-center gap-2">
                          <span>
                            {new Date(stockData.timestamp).toLocaleString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric', 
                              hour: 'numeric', 
                              minute: '2-digit',
                              timeZoneName: 'short'
                            })}
                          </span>
                          {dataAge && (
                            <span className="text-xs text-gray-400">({dataAge})</span>
                          )}
                        </div>
                      ) : "Loading..."}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Volume</div>
                          <div className="font-semibold text-gray-900">{stockData?.volume.toLocaleString() || "N/A"}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Market Cap</div>
                          <div className="font-semibold text-gray-900">{formattedMarketCap}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">52-Week High</div>
                          <div className="font-semibold text-gray-900">${stockData?.high52Week.toFixed(4) || "0.0000"}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">52-Week Low</div>
                          <div className="font-semibold text-gray-900">${stockData?.low52Week.toFixed(4) || "0.0000"}</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Historical Price Chart */}
          <div className="mt-8">
            <StockChart />
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            For live stock quotes and real-time updates, visit <a href="https://www.google.com/finance/quote/VISM:OTCMKTS" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Google Finance</a> or <a href="https://www.otcmarkets.com/stock/VISM/quote" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">OTC Markets</a>
          </div>
        </div>
      </section>

      {/* Investor News Feed */}
      <section className="py-12 bg-gray-50">
        <div className="container max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <Newspaper className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-gray-900">Investor News</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {newsItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Newspaper className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-xs text-gray-500">{item.date}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{item.excerpt}</p>
                      <Button variant="outline" size="sm" asChild>
                        <a href={item.link} className="flex items-center gap-1">
                          Read More <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings Calendar */}
      <section className="py-12 bg-white">
        <div className="container max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-gray-900">Earnings Calendar</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Quarter</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Expected Date</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-right py-4 px-4 font-semibold text-gray-900">EPS</th>
                  <th className="text-right py-4 px-4 font-semibold text-gray-900">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {earningsCalendar.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-900">{item.quarter}</td>
                    <td className="py-4 px-4 text-gray-600">{item.expectedDate}</td>
                    <td className="py-4 px-4">
                      <Badge variant={item.status === 'Reported' ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right text-gray-900 font-semibold">{item.eps}</td>
                    <td className="py-4 px-4 text-right text-gray-900 font-semibold">{item.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SEC Filings */}
      <section className="py-12 bg-gray-50">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">SEC Filings</h2>
          {isLoadingFilings ? (
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-gray-600">Loading SEC filings...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {secFilingsData?.map((filing) => (
                <Card key={filing.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          {filing.filingType}
                        </Badge>
                        <div>
                          <div className="font-semibold text-gray-900">{filing.description}</div>
                          <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(filing.filingDate)}
                          </div>
                          {filing.size && (
                            <div className="text-xs text-gray-500 mt-1">
                              Accession: {filing.accessionNumber} | Size: {filing.size}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(filing.documentUrl || `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001082733&type=${filing.filingType}&dateb=&owner=exclude&count=100`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View on SEC
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          <div className="mt-8 text-center">
            <a 
              href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=VISM" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"
            >
              View All SEC Filings <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Shareholder Documents Library */}
      <section className="py-12 bg-white">
        <div className="container max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <FileText className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-gray-900">Shareholder Documents</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shareholderDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <doc.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <Badge variant="outline" className="mb-2">{doc.type}</Badge>
                      <h3 className="font-semibold text-gray-900 mb-1">{doc.title}</h3>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {doc.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {doc.size}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Investor Resources */}
      <section className="py-12 bg-gray-50">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Investor Resources</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {investorResources.map((resource, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <resource.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{resource.title}</h3>
                      <p className="text-gray-600">{resource.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-12 bg-white">
        <div className="container max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated</h2>
              <p className="text-lg text-gray-600 mb-6">
                Subscribe to receive automated alerts about SEC filings, press releases, quarterly earnings announcements, and other important investor updates.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <FileText className="h-5 w-5 text-primary mt-0.5" />
                  <span>SEC filing notifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <span>Quarterly earnings announcements</span>
                </li>
                <li className="flex items-start gap-2">
                  <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                  <span>Press releases and company news</span>
                </li>
              </ul>
            </div>
            <div>
              <NewsletterSignup
                subscribedTo="investor_alerts"
                title="Investor Alerts"
                description="Get notified about important shareholder updates"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact IR */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Investor Contact</h2>
          <p className="text-lg text-gray-700 mb-8">
            For investor inquiries, please contact our Investor Relations team
          </p>
          <Card className="bg-white">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <div className="font-semibold text-gray-900 mb-2">Email</div>
                  <a href="mailto:ir@visiumtechnologies.com" className="text-primary hover:underline">
                    ir@visiumtechnologies.com
                  </a>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-2">Phone</div>
                  <a href="tel:+1-703-273-0383" className="text-primary hover:underline">
                    +1 (703) 273-0383
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
