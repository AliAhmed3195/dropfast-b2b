'use client'

import { Card } from '../../../../src/app/components/ui/card'

export default function ProductHunterSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your product hunter account.</p>
      </div>
      <Card className="p-6">
        <p className="text-muted-foreground">Settings options will appear here.</p>
      </Card>
    </div>
  )
}
