import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Download, 
  FileText, 
  DollarSign,
  BarChart3,
  ExternalLink,
  Clock
} from "lucide-react";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { RefreshCw } from "lucide-react";
import StockChart from "@/components/StockChart";
import NewsletterSignup from "@/components/NewsletterSignup";
import { SEOHead } from "@/components/SEOHead";

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

  // Fetch real SEC filings from database
  const { data: secFilingsData, isLoading: isLoadingFilings } = trpc.secFilings.getRecent.useQuery({ limit: 20 });
  
  // Format date for display
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

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
    { title: "Stock Information", description: "Detailed stock performance data", icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Investor Relations | Tyvanto"
        description="Investor relations for Tyvanto (OTCQB: VISM). Access SEC filings, stock information, shareholder documents, and company announcements."
        canonicalUrl="https://www.tyvanto.com/company/investor-relations"
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-16">
        <div className="container">
          <div className="max-w-4xl">
            <Badge className="bg-white/20 text-white border-white/30 mb-4">
              OTCQB: VISM
            </Badge>
            <h1 className="text-5xl font-bold mb-4">Investor Relations</h1>
            <p className="text-xl text-white/90">
              Tyvanto is committed to providing transparent and timely information to our shareholders and the investment community.
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
                    <div className="text-sm text-gray-600 mb-1">Tyvanto Inc.</div>
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
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-xs text-gray-600 uppercase tracking-wide">Volume</div>
                          <div className="text-lg font-semibold text-gray-900">{stockData?.volume.toLocaleString() || "N/A"}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 uppercase tracking-wide">Market Cap</div>
                          <div className="text-lg font-semibold text-gray-900">{formattedMarketCap}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 uppercase tracking-wide">52-Week High</div>
                          <div className="text-lg font-semibold text-gray-900">$0.0461</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 uppercase tracking-wide">52-Week Low</div>
                          <div className="text-lg font-semibold text-gray-900">$0.0010</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Historical Price Chart */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Historical Price Chart</h3>
              <StockChart />
              <p className="text-xs text-gray-500 mt-4">
                Historical data sourced from Nasdaq via Yahoo Finance API. Data updates every 15 minutes during market hours.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                For live stock quotes and real-time updates, visit{" "}
                <a href="https://www.google.com/finance/quote/VISM:OTCMKTS" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Google Finance
                </a>
                {" "}or{" "}
                <a href="https://www.otcmarkets.com/stock/VISM/overview" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  OTC Markets
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SEC Filings Section */}
      <section className="py-12 bg-gray-50">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            SEC Filings
          </h2>

          {isLoadingFilings ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              {secFilingsData?.map((filing: any) => (
                <Card key={filing.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className="text-xs font-mono">
                            {filing.filingType}
                          </Badge>
                          <span className="text-sm text-gray-600">{formatDate(filing.filingDate)}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{filing.description}</h3>
                        <div className="text-xs text-gray-500 space-y-1">
                          <p>Accession: {filing.accessionNumber} | Size: {filing.fileSize}</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        asChild
                        className="whitespace-nowrap"
                      >
                        <a 
                          href={filing.documentUrl || `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001082733&type=8-K&dateb=&owner=include&count=40`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View on SEC
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Button variant="outline" asChild className="w-full">
            <a href="https://www.sec.gov/cgi-bin/browse-edgar?company=Tyvanto+Technologies&match=starts-with&action=getcompany" target="_blank" rel="noopener noreferrer">
              View All SEC Filings
            </a>
          </Button>
        </div>
      </section>

      {/* Shareholder Documents Section */}
      <section className="py-12 bg-white">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <Download className="h-8 w-8 text-primary" />
            Shareholder Documents
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shareholderDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <FileText className="h-8 w-8 text-primary" />
                    <Badge variant="secondary" className="text-xs">
                      {doc.type}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{doc.title}</h3>
                  <div className="text-xs text-gray-500 space-y-1 mb-4">
                    <p>{doc.date}</p>
                    <p>{doc.size}</p>
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

      {/* Investor Resources Section */}
      <section className="py-12 bg-gray-50">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Investor Resources</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investorResources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <Icon className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
                    <p className="text-sm text-gray-600">{resource.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="py-12 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-white/90 mb-8">
            Subscribe to receive automated alerts about SEC filings, press releases, quarterly earnings announcements, and other important investor updates.
          </p>
          <NewsletterSignup />
        </div>
      </section>

      {/* Investor Contact Section */}
      <section className="py-12 bg-white">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Investor Contact</h2>
          <Card>
            <CardContent className="p-8">
              <p className="text-gray-600 mb-6">
                For investor inquiries, please contact our Investor Relations team
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                  <a href="mailto:ir@tyvanto.com" className="text-primary hover:underline">
                    ir@tyvanto.com
                  </a>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                  <a href="tel:+18883449850" className="text-primary hover:underline">
                    +1 (888) 344-9850
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
