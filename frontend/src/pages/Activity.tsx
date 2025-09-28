import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/contexts/Web3Context";
import { Activity, ArrowLeftRight, Shield, Clock, CheckCircle, ExternalLink, RefreshCw } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "swap" | "identity" | "transfer";
  description: string;
  amount?: string;
  timestamp: Date;
  status: "completed" | "pending" | "failed";
  txHash?: string;
}

const ActivityPage = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected, receipts, refreshReceipts } = useWeb3();

  useEffect(() => {
    if (receipts.length > 0) {
      const activityItems: ActivityItem[] = receipts.map((receipt) => ({
        id: receipt.receiptHash,
        type: "swap" as const,
        description: receipt.swapDetails,
        timestamp: new Date(receipt.timestamp * 1000),
        status: "completed" as const,
        txHash: receipt.receiptHash,
      }));
      setActivities(activityItems);
    }
  }, [receipts]);

  const handleRefresh = async () => {
    setIsLoading(true);
    await refreshReceipts();
    setIsLoading(false);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "swap": return <ArrowLeftRight className="w-5 h-5" />;
      case "identity": return <Shield className="w-5 h-5" />;
      case "transfer": return <Activity className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/20 text-green-400 border-green-400/50";
      case "pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-400/50";
      case "failed": return "bg-red-500/20 text-red-400 border-red-400/50";
      default: return "bg-gray-500/20 text-gray-400 border-gray-400/50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 font-futuristic text-white-glow">
                Activity
              </h1>
              <p className="text-lg text-white/70 font-mono-space">
                Track all your Web3 transactions and activities
              </p>
            </div>
            <Button 
              onClick={handleRefresh}
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Activity List */}
        <div className="space-y-4">
          {!isConnected ? (
            <Card className="glass-card terminal-border hover-lift">
              <CardContent className="p-12 text-center">
                <Activity className="w-16 h-16 text-white/40 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2 font-futuristic text-white">No Wallet Connected</h3>
                <p className="text-white/70 font-code">
                  Connect your wallet to view your transaction history.
                </p>
              </CardContent>
            </Card>
          ) : activities.length === 0 ? (
            <Card className="glass-card terminal-border hover-lift">
              <CardContent className="p-12 text-center">
                <Activity className="w-16 h-16 text-white/40 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2 font-futuristic text-white">No Activity Yet</h3>
                <p className="text-white/70 font-code">
                  Start by creating an identity or performing token swaps to see your activity here.
                </p>
              </CardContent>
            </Card>
          ) : (
            activities.map((activity) => (
              <Card key={activity.id} className="bg-white/80 backdrop-blur-sm border border-white/30 shadow-xl hover:shadow-2xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 mb-1">
                          {activity.description}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <span>{activity.timestamp.toLocaleString()}</span>
                          {activity.amount && (
                            <span className="font-medium">{activity.amount}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge className={`${getStatusColor(activity.status)} border`}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(activity.status)}
                          <span className="capitalize">{activity.status}</span>
                        </div>
                      </Badge>
                      
                      {activity.txHash && (
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
