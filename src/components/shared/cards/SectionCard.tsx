import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'

interface SectionCardProps {
  icon: React.ElementType
  title: string
  children: React.ReactNode
}

export const SectionCard: React.FC<SectionCardProps> = ({ icon: Icon, title, children }) => {
  const { i18n } = useTranslation()

  return (
    <Card className="overflow-hidden rounded-xl border border-border/60" dir={i18n.dir()}>
      <CardContent className="p-6 text-start sm:p-8">
        <div className="mb-6 flex items-center gap-3 border-b border-border/50 pb-4 text-start">
          <div className="rounded-xl bg-primary/10 p-2 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold text-text">{title}</h2>
        </div>
        {children}
      </CardContent>
    </Card>
  )
}

interface DetailItemProps {
  icon: React.ReactNode
  label: string
  value: string
}

export const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value }) => {
  const { i18n } = useTranslation()

  return (
    <div className="flex items-start gap-3 text-start" dir={i18n.dir()}>
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
        {icon}
      </div>
      <div className="min-w-0 text-start">
        <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">{label}</p>
        <p className="mt-0.5 wrap-words text-sm font-semibold text-text">{value}</p>
      </div>
    </div>
  )
}
