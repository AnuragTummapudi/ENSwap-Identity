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
          <h1 className="text-4xl font-bold mb-2 font-futuristic text-white-glow">
            Settings
          </h1>
          <p className="text-lg text-white/70 font-mono-space">
            Manage your ENSwap Identity preferences and configurations
          </p>
        </div>

        <div className="grid gap-6">
          {/* Identity Settings */}
          <Card className="glass-card terminal-border hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                <span className="font-futuristic text-white">Identity Settings</span>
              </CardTitle>
              <CardDescription className="text-white/70 font-code">
                Manage your Web3 identity and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {identity ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-500/20 border border-green-400/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-green-400 font-code">Identity Connected</h3>
                        <p className="text-sm text-green-400/80 font-code">{identity.ensName}</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-400/50">
                        Active
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-white font-code">ENS Name</Label>
                      <Input value={identity.ensName} disabled className="mt-1 input-glass font-code" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-white font-code">DID Identity</Label>
                      <Input value={identity.did} disabled className="mt-1 input-glass font-code" />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={disconnectWallet} className="text-red-400 border-red-400/50 hover:bg-red-500/10 btn-secondary">
                      Disconnect Identity
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-white/40 mx-auto mb-3 opacity-50" />
                  <p className="text-white/70 font-code">No identity connected</p>
                  <p className="text-sm text-white/60 font-code">Create an identity to access these settings</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* API Configuration */}
          <Card className="glass-card terminal-border hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 text-purple-400" />
                <span className="font-futuristic text-white">API Configuration</span>
              </CardTitle>
              <CardDescription className="text-white/70 font-code">
                Configure API keys and external service connections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="apiKey" className="text-sm font-medium text-white font-code">1inch API Key</Label>
                <Input
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="mt-1 input-glass font-code"
                  type="password"
                />
                <p className="text-xs text-white/60 mt-1 font-code">Used for token swap quotes and pricing</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-white font-code">Contract Address</Label>
                  <Input value="0x522884a14f04b584165fB87eFebEe6a8C480d623" disabled className="mt-1 input-glass font-code" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-white font-code">Project ID</Label>
                  <Input value="aea25227957bdbe6ba50b99b18e6a69c" disabled className="mt-1 input-glass font-code" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="glass-card terminal-border hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-400" />
                <span className="font-futuristic text-white">Notifications</span>
              </CardTitle>
              <CardDescription className="text-white/70 font-code">
                Configure how you receive updates and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-white font-code">Push Notifications</Label>
                  <p className="text-xs text-white/60 font-code">Get notified about transaction updates</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-white font-code">Auto Refresh</Label>
                  <p className="text-xs text-white/60 font-code">Automatically refresh data every 30 seconds</p>
                </div>
                <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="glass-card terminal-border hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-pink-400" />
                <span className="font-futuristic text-white">Appearance</span>
              </CardTitle>
              <CardDescription className="text-white/70 font-code">
                Customize the look and feel of your interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-white font-code">Dark Mode</Label>
                  <p className="text-xs text-white/60 font-code">Switch to dark theme</p>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="glass-card terminal-border hover-lift border-red-400/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <Trash2 className="w-5 h-5" />
                <span className="font-futuristic">Danger Zone</span>
              </CardTitle>
              <CardDescription className="text-white/70 font-code">
                Irreversible actions that affect your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-500/20 border border-red-400/50 rounded-lg">
                <h3 className="font-semibold text-red-400 mb-2 font-code">Clear All Data</h3>
                <p className="text-sm text-red-400/80 mb-3 font-code">
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
