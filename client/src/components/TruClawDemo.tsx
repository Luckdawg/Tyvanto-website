import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Zap, Lock, Eye, Pause, Play, RotateCcw } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  type: 'authorized' | 'shadow' | 'suspicious';
  status: 'discovered' | 'monitored' | 'quarantined' | 'enforced';
  riskLevel: number;
  actions: number;
  connections: string[];
  discoveredAt: number;
}

interface DemoState {
  isRunning: boolean;
  agents: Agent[];
  time: number;
  selectedAgent: Agent | null;
  totalAgentsDiscovered: number;
  policiesEnforced: number;
  threatsBlocked: number;
}

const INITIAL_AGENTS: Agent[] = [
  {
    id: 'agent-1',
    name: 'DocumentProcessor',
    type: 'authorized',
    status: 'monitored',
    riskLevel: 15,
    actions: 234,
    connections: ['agent-3', 'agent-5'],
    discoveredAt: 0
  },
  {
    id: 'agent-2',
    name: 'DataAnalyzer',
    type: 'authorized',
    status: 'monitored',
    riskLevel: 8,
    actions: 156,
    connections: ['agent-4'],
    discoveredAt: 2
  }
];

const SHADOW_AGENTS: Agent[] = [
  {
    id: 'agent-3',
    name: 'UnauthorizedScraper',
    type: 'shadow',
    status: 'discovered',
    riskLevel: 87,
    actions: 0,
    connections: ['agent-1'],
    discoveredAt: 5
  },
  {
    id: 'agent-4',
    name: 'PrivilegeEscalator',
    type: 'shadow',
    status: 'discovered',
    riskLevel: 92,
    actions: 0,
    connections: ['agent-2'],
    discoveredAt: 8
  },
  {
    id: 'agent-5',
    name: 'DataExfiltrator',
    type: 'suspicious',
    status: 'discovered',
    riskLevel: 76,
    actions: 0,
    connections: ['agent-1'],
    discoveredAt: 11
  }
];

export default function ArqenCommandDemo() {
  const [demoState, setDemoState] = useState<DemoState>({
    isRunning: false,
    agents: INITIAL_AGENTS,
    time: 0,
    selectedAgent: null,
    totalAgentsDiscovered: 2,
    policiesEnforced: 0,
    threatsBlocked: 0
  });

  useEffect(() => {
    if (!demoState.isRunning) return;

    const interval = setInterval(() => {
      setDemoState(prev => {
        const newTime = prev.time + 1;
        const newAgents = [...prev.agents];

        // Discover shadow agents over time
        SHADOW_AGENTS.forEach(shadowAgent => {
          if (shadowAgent.discoveredAt === newTime && !newAgents.find(a => a.id === shadowAgent.id)) {
            newAgents.push({ ...shadowAgent, status: 'discovered' });
          }
        });

        // Update agent status based on time
        newAgents.forEach(agent => {
          if (agent.type === 'shadow' && newTime > agent.discoveredAt + 2 && agent.status === 'discovered') {
            agent.status = 'monitored';
          }
          if (agent.type === 'shadow' && newTime > agent.discoveredAt + 4 && agent.status === 'monitored') {
            agent.status = 'quarantined';
          }
        });

        const totalDiscovered = newAgents.length;
        const policiesEnforced = newAgents.filter(a => a.status === 'quarantined' || a.status === 'enforced').length;
        const threatsBlocked = policiesEnforced;

        return {
          ...prev,
          time: newTime,
          agents: newAgents,
          totalAgentsDiscovered: totalDiscovered,
          policiesEnforced: policiesEnforced,
          threatsBlocked: threatsBlocked
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [demoState.isRunning]);

  const toggleDemo = () => {
    setDemoState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const resetDemo = () => {
    setDemoState({
      isRunning: false,
      agents: INITIAL_AGENTS,
      time: 0,
      selectedAgent: null,
      totalAgentsDiscovered: 2,
      policiesEnforced: 0,
      threatsBlocked: 0
    });
  };

  const getAgentColor = (agent: Agent) => {
    if (agent.type === 'authorized') return 'bg-green-50 border-green-200';
    if (agent.type === 'shadow') return 'bg-red-50 border-red-200';
    return 'bg-yellow-50 border-yellow-200';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'monitored':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'quarantined':
        return <Lock className="h-4 w-4 text-red-500" />;
      case 'enforced':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="w-full space-y-6">
      {/* Demo Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div className="flex gap-3">
          <Button
            onClick={toggleDemo}
            className={demoState.isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'}
          >
            {demoState.isRunning ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Demo
              </>
            )}
          </Button>
          <Button onClick={resetDemo} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
        <div className="text-sm font-mono text-gray-600">
          Time: {demoState.time}s
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Agents Discovered</p>
                <p className="text-3xl font-bold text-gray-900">{demoState.totalAgentsDiscovered}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Policies Enforced</p>
                <p className="text-3xl font-bold text-gray-900">{demoState.policiesEnforced}</p>
              </div>
              <Lock className="h-8 w-8 text-red-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Threats Blocked</p>
                <p className="text-3xl font-bold text-gray-900">{demoState.threatsBlocked}</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Grid */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">AI Agents in Your Environment</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {demoState.agents.map(agent => (
            <Card
              key={agent.id}
              className={`cursor-pointer transition-all hover:shadow-lg border-2 ${getAgentColor(agent)} ${
                demoState.selectedAgent?.id === agent.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setDemoState(prev => ({ ...prev, selectedAgent: agent }))}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-900">{agent.name}</p>
                    <p className="text-xs text-gray-600 mt-1">ID: {agent.id}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(agent.status)}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold text-gray-900">{getStatusLabel(agent.status)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className={`font-semibold ${
                      agent.type === 'authorized' ? 'text-green-600' :
                      agent.type === 'shadow' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      {agent.type.charAt(0).toUpperCase() + agent.type.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Risk Level:</span>
                    <span className="font-semibold text-gray-900">{agent.riskLevel}%</span>
                  </div>

                  {/* Risk Level Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        agent.riskLevel > 70 ? 'bg-red-500' :
                        agent.riskLevel > 40 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${agent.riskLevel}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <span className="text-gray-600">Actions:</span>
                    <span className="font-semibold text-gray-900">{agent.actions}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Agent Details */}
      {demoState.selectedAgent && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">Agent Details: {demoState.selectedAgent.name}</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Agent ID</p>
                  <p className="font-mono text-gray-900">{demoState.selectedAgent.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Type</p>
                  <p className="font-semibold text-gray-900">{demoState.selectedAgent.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(demoState.selectedAgent.status)}
                    <span className="font-semibold text-gray-900">{getStatusLabel(demoState.selectedAgent.status)}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Risk Assessment</p>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          demoState.selectedAgent.riskLevel > 70 ? 'bg-red-500' :
                          demoState.selectedAgent.riskLevel > 40 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${demoState.selectedAgent.riskLevel}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-gray-900 min-w-fit">{demoState.selectedAgent.riskLevel}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Connected Agents</p>
                  <div className="flex flex-wrap gap-2">
                    {demoState.selectedAgent.connections.length > 0 ? (
                      demoState.selectedAgent.connections.map(connId => (
                        <span key={connId} className="bg-white px-2 py-1 rounded text-xs font-mono text-gray-700 border border-gray-300">
                          {connId}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-600 text-sm">No connections</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {demoState.selectedAgent.type === 'shadow' && demoState.selectedAgent.status === 'quarantined' && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">Shadow AI Detected & Quarantined</p>
                  <p className="text-sm text-red-800 mt-1">This unauthorized agent has been isolated from enterprise systems. All policy violations have been logged for compliance.</p>
                </div>
              </div>
            )}

            {demoState.selectedAgent.type === 'authorized' && (
              <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900">Authorized Agent - Monitored</p>
                  <p className="text-sm text-green-800 mt-1">This agent is authorized and operating within policy boundaries. Continuous monitoring ensures compliance.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Demo Info */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600">
          <strong>Demo Simulation:</strong> This interactive demo shows how Arqen Command discovers shadow AI agents in real-time, monitors their behavior, and enforces governance policies. Watch as unauthorized agents are detected and quarantined automatically. In production, Arqen Command provides sub-second detection latency and comprehensive audit trails for compliance.
        </p>
      </div>
    </div>
  );
}
