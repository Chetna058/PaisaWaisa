import React from 'react';
import { HealthAlert, Currency } from '../types/finance';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: HealthAlert[];
  onTriggerAlertAction: (alert: HealthAlert) => void;
  currency: Currency;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  alerts,
  onTriggerAlertAction,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end p-4 md:p-6 bg-black/20 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="mt-16 w-full max-w-sm rounded-xl bg-surface-container-lowest shadow-2xl p-space-md border border-surface-container-high"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">notifications_active</span>
            <span className="font-headline-sm text-headline-sm font-bold text-on-surface text-base">
              Campus Alerts
            </span>
          </div>
          <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-bold">
            {alerts.length} New
          </span>
        </div>

        <div className="mt-space-sm flex flex-col gap-space-sm max-h-[70vh] overflow-y-auto">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border text-sm flex flex-col gap-1.5 transition-all ${
                alert.type === 'high'
                  ? 'bg-tertiary-fixed/30 border-tertiary/20'
                  : alert.type === 'caution'
                  ? 'bg-primary-fixed/20 border-primary/20'
                  : 'bg-secondary-container/20 border-secondary/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`font-label-sm text-label-sm uppercase font-bold px-1.5 py-0.5 rounded text-xs ${
                    alert.type === 'high'
                      ? 'bg-tertiary text-on-tertiary'
                      : alert.type === 'caution'
                      ? 'bg-primary text-on-primary'
                      : 'bg-secondary text-on-secondary'
                  }`}
                >
                  {alert.badge}
                </span>
                <span className="font-metric-num-sm text-xs font-bold text-on-surface">
                  {alert.percentage}%
                </span>
              </div>
              <p className="font-semibold text-on-surface text-sm mt-0.5">{alert.title}</p>
              <p className="text-on-surface-variant text-xs">{alert.description}</p>
              {alert.actionText && (
                <div className="mt-1 pt-1 flex justify-end">
                  <button
                    onClick={() => {
                      onTriggerAlertAction(alert);
                      onClose();
                    }}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    {alert.actionText} →
                  </button>
                </div>
              )}
            </div>
          ))}

          <div className="p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between text-xs text-on-surface-variant">
            <span>Mess Rebate status for Diwali vacation</span>
            <span className="text-secondary font-semibold">Credited ₹450</span>
          </div>
        </div>

        <div className="mt-space-sm pt-space-xs flex justify-between items-center border-t border-surface-container-high text-xs text-on-surface-variant">
          <span>Synced with Oriental College of Technology &amp; Campus Hostel</span>
          <button onClick={onClose} className="text-primary font-semibold hover:underline">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
