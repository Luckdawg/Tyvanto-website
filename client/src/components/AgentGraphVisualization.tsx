import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Node {
  id: string;
  label: string;
  type: 'authorized' | 'shadow' | 'suspicious';
  status: 'discovered' | 'monitored' | 'quarantined' | 'enforced';
  x: number;
  y: number;
  vx: number;
  vy: number;
  riskLevel: number;
}

interface Link {
  source: string;
  target: string;
  type: 'data-flow' | 'privilege-escalation' | 'lateral-movement';
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

const GRAPH_DATA: GraphData = {
  nodes: [
    { id: 'agent-1', label: 'DocumentProcessor', type: 'authorized', status: 'monitored', x: 300, y: 150, vx: 0, vy: 0, riskLevel: 15 },
    { id: 'agent-2', label: 'DataAnalyzer', type: 'authorized', status: 'monitored', x: 500, y: 150, vx: 0, vy: 0, riskLevel: 8 },
    { id: 'agent-3', label: 'UnauthorizedScraper', type: 'shadow', status: 'discovered', x: 200, y: 300, vx: 0, vy: 0, riskLevel: 87 },
    { id: 'agent-4', label: 'PrivilegeEscalator', type: 'shadow', status: 'discovered', x: 600, y: 300, vx: 0, vy: 0, riskLevel: 92 },
    { id: 'agent-5', label: 'DataExfiltrator', type: 'suspicious', status: 'discovered', x: 400, y: 400, vx: 0, vy: 0, riskLevel: 76 }
  ],
  links: [
    { source: 'agent-1', target: 'agent-3', type: 'data-flow' },
    { source: 'agent-1', target: 'agent-5', type: 'lateral-movement' },
    { source: 'agent-2', target: 'agent-4', type: 'privilege-escalation' }
  ]
};

export default function AgentGraphVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>(GRAPH_DATA.nodes);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = '#f0f0f0';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw links
      GRAPH_DATA.links.forEach(link => {
        const sourceNode = nodes.find(n => n.id === link.source);
        const targetNode = nodes.find(n => n.id === link.target);
        if (!sourceNode || !targetNode) return;

        ctx.strokeStyle = 
          link.type === 'privilege-escalation' ? '#ef4444' :
          link.type === 'lateral-movement' ? '#f59e0b' :
          '#94a3b8';
        ctx.lineWidth = 2;
        ctx.setLineDash(link.type === 'privilege-escalation' ? [5, 5] : []);
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw arrow
        const angle = Math.atan2(targetNode.y - sourceNode.y, targetNode.x - sourceNode.x);
        const arrowSize = 10;
        ctx.fillStyle = ctx.strokeStyle;
        ctx.beginPath();
        ctx.moveTo(targetNode.x, targetNode.y);
        ctx.lineTo(targetNode.x - arrowSize * Math.cos(angle - Math.PI / 6), targetNode.y - arrowSize * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(targetNode.x - arrowSize * Math.cos(angle + Math.PI / 6), targetNode.y - arrowSize * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
      });

      // Draw nodes
      nodes.forEach(node => {
        const isSelected = selectedNode?.id === node.id;
        const radius = isSelected ? 35 : 28;

        // Node shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;

        // Node circle
        ctx.fillStyle =
          node.type === 'authorized' ? '#10b981' :
          node.type === 'shadow' ? '#ef4444' :
          '#f59e0b';
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Node border
        ctx.strokeStyle = isSelected ? '#000000' : 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.stroke();

        // Status indicator
        ctx.shadowColor = 'transparent';
        const statusRadius = 8;
        const statusColor =
          node.status === 'monitored' ? '#3b82f6' :
          node.status === 'quarantined' ? '#dc2626' :
          node.status === 'enforced' ? '#059669' :
          '#eab308';
        ctx.fillStyle = statusColor;
        ctx.beginPath();
        ctx.arc(node.x + radius - 5, node.y - radius + 5, statusRadius, 0, Math.PI * 2);
        ctx.fill();

        // Node label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const lines = node.label.split(/(?=[A-Z])/);
        lines.forEach((line, i) => {
          ctx.fillText(line, node.x, node.y - 5 + (i * 12));
        });

        // Risk level indicator
        if (node.riskLevel > 50) {
          ctx.fillStyle = `rgba(239, 68, 68, ${0.3 + (node.riskLevel / 100) * 0.5})`;
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius + 8, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      setAnimationFrame(prev => prev + 1);
      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [nodes, selectedNode]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if click is on a node
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
      return distance < 35;
    });

    setSelectedNode(clickedNode || null);
  };

  const getLegendItems = () => [
    { label: 'Authorized Agent', color: '#10b981' },
    { label: 'Shadow AI', color: '#ef4444' },
    { label: 'Suspicious Agent', color: '#f59e0b' }
  ];

  const getLinkLegendItems = () => [
    { label: 'Data Flow', style: 'solid', color: '#94a3b8' },
    { label: 'Privilege Escalation', style: 'dashed', color: '#ef4444' },
    { label: 'Lateral Movement', style: 'solid', color: '#f59e0b' }
  ];

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Agent Relationship Graph</h3>
          <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              onClick={handleCanvasClick}
              className="w-full border-b border-gray-200 cursor-pointer bg-white"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Click on any agent node to view detailed information. Dashed lines indicate privilege escalation risks.
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Legend */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold text-gray-900 mb-3">Agent Types</h4>
            <div className="space-y-2">
              {getLegendItems().map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Connection Types */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold text-gray-900 mb-3">Connection Types</h4>
            <div className="space-y-2">
              {getLinkLegendItems().map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <svg width="24" height="2" className="flex-shrink-0">
                    {item.style === 'dashed' ? (
                      <>
                        <line x1="0" y1="1" x2="6" y2="1" stroke={item.color} strokeWidth="2" />
                        <line x1="8" y1="1" x2="14" y2="1" stroke={item.color} strokeWidth="2" />
                        <line x1="16" y1="1" x2="22" y2="1" stroke={item.color} strokeWidth="2" />
                      </>
                    ) : (
                      <line x1="0" y1="1" x2="24" y2="1" stroke={item.color} strokeWidth="2" />
                    )}
                  </svg>
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Node Details */}
      {selectedNode && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Selected Agent: {selectedNode.label}</h4>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Type</p>
                <p className="font-semibold text-gray-900">{selectedNode.type}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Status</p>
                <p className="font-semibold text-gray-900">{selectedNode.status}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Risk Level</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        selectedNode.riskLevel > 70 ? 'bg-red-500' :
                        selectedNode.riskLevel > 40 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${selectedNode.riskLevel}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold text-gray-900 min-w-fit">{selectedNode.riskLevel}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
