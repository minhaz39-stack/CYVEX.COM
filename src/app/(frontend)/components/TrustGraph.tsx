'use client'

import {
  Background,
  Controls,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from '@xyflow/react'
import { Check, Shield, TriangleAlert } from 'lucide-react'
import type { CertificateNode } from '@/lib/aegis-types'
import '@xyflow/react/dist/style.css'

type TrustNode = Node<{ certificate: CertificateNode }, 'trust'>

function CertificateCard({ data }: NodeProps<TrustNode>) {
  const cert = data.certificate
  const healthy = cert.state === 'pass'
  return (
    <div className="w-64 rounded-xl border border-white/12 bg-[#10201b] p-4 shadow-xl">
      <Handle type="target" position={Position.Top} className="!border-0 !bg-emerald-300" />
      <div className="flex items-start gap-3">
        <span
          className={`grid size-9 shrink-0 place-items-center rounded-lg ${healthy ? 'bg-emerald-300/10 text-emerald-300' : 'bg-amber-300/10 text-amber-300'}`}
        >
          {healthy ? <Shield className="size-4" /> : <TriangleAlert className="size-4" />}
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-white">{cert.subject}</p>
          <p className="mt-1 text-[10px] text-[#7e938b]">{cert.algorithm}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5 border-t border-white/7 pt-3 text-[10px] text-[#8fa49c]">
        <Check className="size-3 text-emerald-300" /> {cert.note}
      </div>
      <Handle type="source" position={Position.Bottom} className="!border-0 !bg-emerald-300" />
    </div>
  )
}

export function TrustGraph({ certificates }: { certificates: CertificateNode[] }) {
  if (!certificates.length)
    return (
      <div className="grid h-80 place-items-center text-sm text-[#72867f]">
        No TLS certificate chain was available.
      </div>
    )
  const nodes: TrustNode[] = certificates.map((certificate, index) => ({
    id: certificate.id,
    type: 'trust',
    position: { x: 90 + index * 300, y: 85 + (index % 2) * 32 },
    data: { certificate },
  }))
  const edges: Edge[] = certificates.slice(0, -1).map((certificate, index) => ({
    id: `edge-${certificate.id}`,
    source: certificate.id,
    target: certificates[index + 1].id,
    animated: true,
    style: { stroke: '#53d99f', strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#53d99f' },
  }))
  return (
    <div className="h-[360px] overflow-hidden rounded-xl">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={{ trust: CertificateCard }}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#234139" gap={22} size={1} />
        <Controls
          showInteractive={false}
          className="!overflow-hidden !rounded-lg !border-white/10 !bg-[#11201c] !shadow-none [&>button]:!border-white/10 [&>button]:!bg-[#11201c] [&>button]:!fill-white"
        />
      </ReactFlow>
    </div>
  )
}
