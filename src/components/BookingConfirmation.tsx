import { ArrowLeft, Calendar, CheckCircle2, Clock, Scissors, User } from 'lucide-react';
import { BarberService, formatUzbekDate } from '../data/services';
import { ResilientImage } from './ResilientImage';

export interface ConfirmedBooking {
  referenceCode: string;
  customerName: string;
  service: BarberService;
  dateIso: string;
  time: string;
}

interface BookingConfirmationProps {
  booking: ConfirmedBooking;
  onReselect: () => void;
  onResetAll: () => void;
}

export function BookingConfirmation({
  booking,
  onReselect,
  onResetAll,
}: BookingConfirmationProps) {
  const formattedDate = formatUzbekDate(booking.dateIso);

  return (
    <section
      aria-live="polite"
      className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-[0_12px_40px_-16px_rgba(20,20,19,0.08)]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left: Visual appearance of the selected service */}
        <div className="lg:col-span-5 relative bg-stone-100 min-h-[280px] lg:min-h-full">
          <ResilientImage
            src={booking.service.image}
            alt={booking.service.imageAlt}
            fallbackTitle={booking.service.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/25 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 text-white">
            <p className="text-xs font-mono tracking-wider text-stone-300 mb-1.5">
              Xizmat ko‘rinishi · {booking.service.index}
            </p>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              {booking.service.title}
            </h3>
            <p className="mt-2 text-sm text-stone-200 leading-relaxed">
              {booking.service.description}
            </p>
            <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-3 text-sm font-mono tabular-nums text-stone-100">
              <span>{booking.service.durationLabel}</span>
              <span aria-hidden="true" className="text-stone-400">·</span>
              <span>{booking.service.priceLabel}</span>
            </div>
          </div>
        </div>

        {/* Right: Structured appointment details & re-selection actions */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <CheckCircle2
                  className="w-6 h-6 text-emerald-700 shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
                    Yozilish tasdiqlandi
                  </h2>
                  <p className="text-sm text-stone-600 mt-0.5">
                    Navbatingiz muvaffaqiyatli ro‘yxatga olindi.
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="block text-xs text-stone-500">Tasdiq raqami</span>
                <span className="font-mono text-sm font-semibold text-stone-900 tabular-nums">
                  {booking.referenceCode}
                </span>
              </div>
            </div>

            <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <dt className="flex items-center gap-2 text-xs font-medium text-stone-500">
                  <User className="w-3.5 h-3.5 text-stone-400" aria-hidden="true" />
                  <span>Mijoz ismi</span>
                </dt>
                <dd className="mt-1.5 text-base font-semibold text-stone-900">
                  {booking.customerName}
                </dd>
              </div>

              <div>
                <dt className="flex items-center gap-2 text-xs font-medium text-stone-500">
                  <Scissors className="w-3.5 h-3.5 text-stone-400" aria-hidden="true" />
                  <span>Tanlangan xizmat</span>
                </dt>
                <dd className="mt-1.5 text-base font-semibold text-stone-900">
                  {booking.service.title}
                </dd>
                <dd className="mt-0.5 text-xs text-stone-500">
                  Usta: {booking.service.master}
                </dd>
              </div>

              <div>
                <dt className="flex items-center gap-2 text-xs font-medium text-stone-500">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" aria-hidden="true" />
                  <span>Sana</span>
                </dt>
                <dd className="mt-1.5 text-base font-semibold text-stone-900 tabular-nums">
                  {formattedDate}
                </dd>
              </div>

              <div>
                <dt className="flex items-center gap-2 text-xs font-medium text-stone-500">
                  <Clock className="w-3.5 h-3.5 text-stone-400" aria-hidden="true" />
                  <span>Vaqt</span>
                </dt>
                <dd className="mt-1.5 text-base font-semibold font-mono text-stone-900 tabular-nums">
                  {booking.time}
                </dd>
                <dd className="mt-0.5 text-xs text-stone-500 font-mono tabular-nums">
                  {booking.service.durationLabel} · {booking.service.priceLabel}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-10 pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={onReselect}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 active:scale-[0.99] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Qayta tanlash</span>
            </button>

            <button
              type="button"
              onClick={onResetAll}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 whitespace-nowrap shrink-0"
            >
              Yangi shakl ochish
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
