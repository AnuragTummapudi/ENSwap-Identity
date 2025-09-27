import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useWeb3 } from "@/contexts/Web3Context";
import { Settings as SettingsIcon, Bell, Shield, Palette, Database, Globe, Key, Trash2 } from "lucide-react";

const SettingsPage = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [apiKey, setApiKey] = useState("3T7z7yeDMd35XLNZhUrBxBx0qBXm490T");
  
  const { isConnected, identity, disconnectWallet } = useWeb3();

  const handleClearData = () => {
    // Clear local storage and reset settings
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-lg text-slate-600">
            Manage your ENSwap Identity preferences and configurations
          </p>
        </div>

        <div className="grid gap-6">
          {/* Identity Settings */}
          <Card className="bg-white/80 backdrop-blur-sm border border-white/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Identity Settings
              </CardTitle>
              <CardDescription>
                Manage your Web3 identity and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {identity ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-green-800">Identity Connected</h3>
                        <p className="text-sm text-green-600">{identity.ensName}</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                        Active
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">ENS Name</Label>
                      <Input value={identity.ensName} disabled className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">DID Identity</Label>
                      <Input value={identity.did} disabled className="mt-1" />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={disconnectWallet} className="text-red-600 border-red-200 hover:bg-red-50">
                      Disconnect Identity
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600">No identity connected</p>
                  <p className="text-sm text-slate-500">Create an identity to access these settings</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* API Configuration */}
          <Card className="bg-white/80 backdrop-blur-sm border border-white/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 text-purple-600" />
                API Configuration
              </CardTitle>
              <CardDescription>
                Configure API keys and external service connections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="apiKey" className="text-sm font-medium">1inch API Key</Label>
                <Input
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="mt-1"
                  type="password"
                />
                <p className="text-xs text-slate-500 mt-1">Used for token swap quotes and pricing</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Contract Address</Label>
                  <Input value="0xEe58d185f59e01034527d95FDd85236fa245Ea9f" disabled className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Project ID</Label>
                  <Input value="aea25227957bdbe6ba50b99b18e6a69c" disabled className="mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-white/80 backdrop-blur-sm border border-white/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-600" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configure how you receive updates and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Push Notifications</Label>
                  <p className="text-xs text-slate-500">Get notified about transaction updates</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Auto Refresh</Label>
                  <p className="text-xs text-slate-500">Automatically refresh data every 30 seconds</p>
                </div>
                <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="bg-white/80 backdrop-blur-sm border border-white/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-pink-600" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Dark Mode</Label>
                  <p className="text-xs text-slate-500">Switch to dark theme</p>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-white/80 backdrop-blur-sm border border-red-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="w-5 h-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible actions that affect your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">Clear All Data</h3>
                <p className="text-sm text-red-600 mb-3">
                  This will clear all local data, settings, and reset the application to its default state.
                </p>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleClearData}
                >
                  Clear All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
