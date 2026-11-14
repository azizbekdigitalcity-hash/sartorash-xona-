import { useRef, useState } from 'react';
import { AlertCircle, ArrowRight, Check, Clock, MapPin, Phone } from 'lucide-react';
import heroStudioImg from './assets/images/barber_studio_hero_1794639990665.jpg';
import {
  BookingConfirmation,
  ConfirmedBooking,
} from './components/BookingConfirmation';
import { ResilientImage } from './components/ResilientImage';
import {
  BARBER_SERVICES,
  ServiceId,
  formatUzbekDate,
  getQuickDateOptions,
  toIsoDate,
} from './data/services';

interface FormErrors {
  service?: string;
  time?: string;
  name?: string;
}

export default function App() {
  const quickDates = getQuickDateOptions();
  const minDateIso = toIsoDate(new Date());

  const [selectedServiceId, setSelectedServiceId] = useState<ServiceId | null>(null);
  const [selectedDateIso, setSelectedDateIso] = useState<string>(quickDates[0].iso);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [confirmedBooking, setConfirmedBooking] = useState<ConfirmedBooking | null>(null);

  const servicesSectionRef = useRef<HTMLElement | null>(null);
  const bookingSectionRef = useRef<HTMLElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const selectedService =
    BARBER_SERVICES.find((item) => item.id === selectedServiceId) ?? null;

  const handleSelectService = (id: ServiceId) => {
    setSelectedServiceId(id);
    // Clear selected time when switching to a different service so the time always matches the service's 3 slots
    if (id !== selectedServiceId) {
      setSelectedTime(null);
    }
    setErrors((prev) => ({ ...prev, service: undefined }));
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    setErrors((prev) => ({ ...prev, time: undefined }));
  };

  const handleNameChange = (value: string) => {
    setCustomerName(value);
    if (value.trim().length >= 2) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const scrollToElement = (el: HTMLElement | null) => {
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = customerName.trim();
    const nextErrors: FormErrors = {};

    if (!selectedService) {
      nextErrors.service = 'Iltimos, avval 3 ta xizmatdan birini tanlang.';
    }
    if (!selectedTime) {
      nextErrors.time = "Iltimos, ko'rsatilgan 3 ta vaqtdan birini tanlang.";
    }
    if (!trimmedName) {
      nextErrors.name = 'Iltimos, ismingizni kiriting.';
    } else if (trimmedName.length < 2) {
      nextErrors.name = "Ism kamida 2 ta harfdan iborat bo'lishi kerak.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      if (nextErrors.service) {
        scrollToElement(servicesSectionRef.current);
      } else if (nextErrors.time) {
        scrollToElement(bookingSectionRef.current);
      } else if (nextErrors.name) {
        nameInputRef.current?.focus();
      }
      return;
    }

    if (!selectedService || !selectedTime) {
      return;
    }

    const randomCode = Math.floor(1000 + Math.random() * 9000);
    setConfirmedBooking({
      referenceCode: `UST-${randomCode}`,
      customerName: trimmedName,
      service: selectedService,
      dateIso: selectedDateIso,
      time: selectedTime,
    });
    setErrors({});

    requestAnimationFrame(() => {
      scrollToElement(bookingSectionRef.current);
    });
  };

  const handleReselect = () => {
    setConfirmedBooking(null);
    requestAnimationFrame(() => {
      scrollToElement(servicesSectionRef.current);
    });
  };

  const handleResetAll = () => {
    setConfirmedBooking(null);
    setSelectedServiceId(null);
    setSelectedDateIso(quickDates[0].iso);
    setSelectedTime(null);
    setCustomerName('');
    setErrors({});
    requestAnimationFrame(() => {
      scrollToElement(servicesSectionRef.current);
    });
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#F7F7F5] text-[#141413]">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="border-b border-stone-200/80 bg-[#F7F7F5]/95 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          <a
            href="#top"
            className="font-serif text-xl font-semibold tracking-tight text-stone-900 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 rounded"
          >
            Usta
          </a>

          <nav
            aria-label="Asosiy navigatsiya"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600"
          >
            <a
              href="#xizmatlar"
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
            >
              Xizmatlar
            </a>
            <a
              href="#vaqt-tanlash"
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
            >
              Vaqt tanlash
            </a>
            <a
              href="#yozilish"
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
            >
              Yozilish
            </a>
            <a
              href="#manzil"
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
            >
              Manzil
            </a>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => {
                if (confirmedBooking) {
                  scrollToElement(bookingSectionRef.current);
                } else if (!selectedService) {
                  scrollToElement(servicesSectionRef.current);
                } else {
                  scrollToElement(bookingSectionRef.current);
                  nameInputRef.current?.focus();
                }
              }}
              className="px-4 py-2 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2"
            >
              Yozilish
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Split Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 lg:pt-14 lg:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center py-2 lg:py-6">
              <p className="text-xs font-medium tracking-wide text-stone-500 mb-4">
                Toshkent · Erkaklar sartaroshxonasi · 09:00 – 21:00
              </p>
              <h1
                className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-stone-900 leading-[1.12]"
                style={{ textWrap: 'balance' }}
              >
                Soch va soqol parvarishi uchun aniq vaqt
              </h1>
              <p className="mt-5 text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl">
                Soch olish, soch turmaklash yoki soqolni tartibga keltirish xizmatlaridan birini
                tanlang, qulay vaqtni belgilang va navbatsiz tashrif buyuring.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => scrollToElement(servicesSectionRef.current)}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2"
                >
                  <span>Xizmatni tanlash</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full min-h-[260px] sm:min-h-[340px] lg:min-h-[380px] rounded-2xl overflow-hidden border border-stone-200 bg-stone-200">
                <ResilientImage
                  src={heroStudioImg}
                  alt="Tabiiy yorug'lik tushib turgan zamonaviy sartaroshxona studiyasi"
                  fallbackTitle="Usta Sartaroshxonasi"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Booking Content Container */}
        {confirmedBooking ? (
          <section
            ref={bookingSectionRef}
            id="yozilish"
            className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 scroll-mt-24"
          >
            <BookingConfirmation
              booking={confirmedBooking}
              onReselect={handleReselect}
              onResetAll={handleResetAll}
            />
          </section>
        ) : (
          <>
            {/* Step 1: 3 Services with Duration & Price */}
            <section
              ref={servicesSectionRef}
              id="xizmatlar"
              className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 scroll-mt-24"
            >
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
                    01. Xizmatni tanlang
                  </h2>
                  <p className="mt-1.5 text-sm text-stone-600">
                    Har bir xizmatning davomiyligi, narxi va bo‘sh vaqtlari aniq ko‘rsatilgan.
                  </p>
                </div>
                <p className="text-xs font-medium text-stone-500">
                  Majburiy tanlov <span className="text-stone-900">*</span>
                </p>
              </div>

              {errors.service ? (
                <div
                  role="alert"
                  className="mt-5 flex items-center gap-2.5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm font-medium"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" aria-hidden="true" />
                  <span>{errors.service}</span>
                </div>
              ) : null}

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {BARBER_SERVICES.map((service) => {
                  const isSelected = selectedServiceId === service.id;
                  return (
                    <article
                      key={service.id}
                      className={`group flex flex-col bg-white rounded-xl overflow-hidden border transition-all duration-200 ${
                        isSelected
                          ? 'border-stone-900 ring-1 ring-stone-900 shadow-[0_10px_30px_-12px_rgba(20,20,19,0.14)] -translate-y-0.5'
                          : 'border-stone-200 hover:border-stone-400 hover:-translate-y-0.5'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectService(service.id)}
                        aria-pressed={isSelected}
                        className="flex flex-col flex-1 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-stone-900"
                      >
                        <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100">
                          <ResilientImage
                            src={service.image}
                            alt={service.imageAlt}
                            fallbackTitle={service.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                        </div>

                        <div className="p-6 flex flex-col flex-1 justify-between w-full">
                          <div>
                            <div className="flex items-center justify-between gap-2 text-xs text-stone-500">
                              <span className="font-mono">{service.index}</span>
                              <span className="truncate">Usta: {service.master}</span>
                            </div>

                            <h3 className="mt-2 font-serif text-xl font-semibold text-stone-900 tracking-tight">
                              {service.title}
                            </h3>

                            <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                              {service.description}
                            </p>
                          </div>

                          <div className="mt-6 pt-4 border-t border-stone-200/80 flex items-center justify-between gap-4 w-full">
                            <div className="flex items-center gap-2 text-sm font-mono tabular-nums text-stone-900">
                              <span>{service.durationLabel}</span>
                              <span aria-hidden="true" className="text-stone-400">·</span>
                              <span className="font-semibold">{service.priceLabel}</span>
                            </div>

                            <span
                              className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                                isSelected
                                  ? 'bg-stone-900 text-white'
                                  : 'bg-stone-100 text-stone-800 group-hover:bg-stone-200'
                              }`}
                            >
                              {isSelected ? (
                                <>
                                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                                  <span>Tanlandi</span>
                                </>
                              ) : (
                                <span>Tanlash</span>
                              )}
                            </span>
                          </div>
                        </div>
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Step 2, 3, 4: Time Selection, Date, Name Input & Validation Submit */}
            <section
              ref={bookingSectionRef}
              id="yozilish"
              className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 scroll-mt-24"
            >
              <form
                onSubmit={handleSubmit}
                noValidate
                className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-10 lg:p-12"
              >
                {/* Top of Booking Panel: 3 Time Slots for the Selected Service */}
                <div
                  id="vaqt-tanlash"
                  className="pb-10 border-b border-stone-200 scroll-mt-24"
                >
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
                        02. Sana va vaqtni tanlang
                      </h2>
                      <p className="mt-1.5 text-sm text-stone-600">
                        {selectedService
                          ? `${selectedService.title} (${selectedService.durationLabel}) uchun mavjud uchta vaqtdan birini belgilang.`
                          : 'Tanlangan xizmat uchun uchta qulay vaqt bu yerda ko‘rsatiladi.'}
                      </p>
                    </div>
                    <p className="text-xs font-medium text-stone-500">
                      Vaqt tanlash majburiy <span className="text-stone-900">*</span>
                    </p>
                  </div>

                  {/* Date & 3 Time Slots Grid */}
                  <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Date selector */}
                    <div className="lg:col-span-5">
                      <label
                        htmlFor="booking-date"
                        className="block text-sm font-medium text-stone-800 mb-3"
                      >
                        Tashrif sanasi
                      </label>
                      <div className="grid grid-cols-3 gap-2.5 mb-3">
                        {quickDates.map((option) => {
                          const active = selectedDateIso === option.iso;
                          return (
                            <button
                              key={option.iso}
                              type="button"
                              onClick={() => setSelectedDateIso(option.iso)}
                              aria-pressed={active}
                              className={`px-3 py-2.5 rounded-lg border text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 ${
                                active
                                  ? 'bg-stone-900 border-stone-900 text-white'
                                  : 'bg-[#F7F7F5] border-stone-200 text-stone-800 hover:border-stone-400'
                              }`}
                            >
                              <span className="block text-xs font-semibold whitespace-nowrap">
                                {option.label}
                              </span>
                              <span
                                className={`block text-[11px] mt-0.5 tabular-nums whitespace-nowrap ${
                                  active ? 'text-stone-300' : 'text-stone-500'
                                }`}
                              >
                                {option.sublabel}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <input
                        id="booking-date"
                        type="date"
                        min={minDateIso}
                        value={selectedDateIso}
                        onChange={(e) => {
                          if (e.target.value) {
                            setSelectedDateIso(e.target.value);
                          }
                        }}
                        className="w-full h-11 px-3.5 rounded-lg border border-stone-200 bg-white text-sm font-mono tabular-nums text-stone-900 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                      />
                    </div>

                    {/* 3 Time slots for the selected service */}
                    <div className="lg:col-span-7">
                      <span className="block text-sm font-medium text-stone-800 mb-3">
                        Mavjud uchta vaqt <span className="text-red-700">*</span>
                      </span>

                      {selectedService ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {selectedService.availableTimes.map((timeSlot) => {
                            const isTimeSelected = selectedTime === timeSlot;
                            return (
                              <button
                                key={timeSlot}
                                type="button"
                                onClick={() => handleSelectTime(timeSlot)}
                                aria-pressed={isTimeSelected}
                                className={`flex flex-col items-start justify-between p-4 rounded-lg border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 min-h-[82px] ${
                                  isTimeSelected
                                    ? 'bg-stone-900 border-stone-900 text-white shadow-sm'
                                    : 'bg-[#F7F7F5] border-stone-200 text-stone-900 hover:border-stone-400'
                                }`}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <Clock
                                    className={`w-4 h-4 ${
                                      isTimeSelected ? 'text-stone-300' : 'text-stone-400'
                                    }`}
                                    aria-hidden="true"
                                  />
                                  {isTimeSelected ? (
                                    <Check className="w-4 h-4 text-white" aria-hidden="true" />
                                  ) : null}
                                </div>
                                <div className="mt-3 flex items-baseline justify-between w-full">
                                  <span className="font-mono text-lg font-semibold tabular-nums">
                                    {timeSlot}
                                  </span>
                                  <span
                                    className={`text-xs ${
                                      isTimeSelected ? 'text-stone-300' : 'text-stone-500'
                                    }`}
                                  >
                                    {isTimeSelected ? 'Tanlandi' : "Bo'sh"}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="rounded-lg border border-dashed border-stone-300 bg-[#F7F7F5] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-h-[82px]">
                          <p className="text-sm text-stone-600">
                            Vaqtlarni ko‘rish uchun yuqoridan xizmat turini tanlang.
                          </p>
                          <button
                            type="button"
                            onClick={() => scrollToElement(servicesSectionRef.current)}
                            className="text-xs font-medium text-stone-900 underline underline-offset-4 hover:text-stone-700 cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-center"
                          >
                            Xizmatlarga o‘tish
                          </button>
                        </div>
                      )}

                      {errors.time ? (
                        <p
                          role="alert"
                          className="mt-3 flex items-center gap-2 text-sm font-medium text-red-700"
                        >
                          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                          <span>{errors.time}</span>
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Step 3 & 4: Name Input & Submit Button */}
                <div className="pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-6">
                    <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
                      03. Ismingizni kiriting
                    </h2>
                    <p className="mt-1.5 text-sm text-stone-600">
                      Usta sizni o‘z vaqtida kutib olishi uchun ismingizni yozib qoldiring.
                    </p>

                    <div className="mt-6">
                      <label
                        htmlFor="customer-name"
                        className="block text-sm font-medium text-stone-800 mb-2"
                      >
                        Ismingiz <span className="text-red-700">*</span>
                      </label>
                      <input
                        ref={nameInputRef}
                        id="customer-name"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="Masalan: Azizbek"
                        value={customerName}
                        onChange={(e) => handleNameChange(e.target.value)}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'customer-name-error' : undefined}
                        className={`w-full h-12 px-4 rounded-lg border text-base text-stone-900 placeholder:text-stone-400 transition-colors focus:outline-none focus:ring-1 ${
                          errors.name
                            ? 'border-red-500 bg-red-50/40 focus:border-red-600 focus:ring-red-600'
                            : 'border-stone-300 bg-white focus:border-stone-900 focus:ring-stone-900'
                        }`}
                      />
                      {errors.name ? (
                        <p
                          id="customer-name-error"
                          role="alert"
                          className="mt-2.5 flex items-center gap-2 text-sm font-medium text-red-700"
                        >
                          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                          <span>{errors.name}</span>
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* Summary & Submit Action */}
                  <div className="lg:col-span-6 bg-[#F7F7F5] rounded-xl p-6 sm:p-7 border border-stone-200/80">
                    <h3 className="text-sm font-semibold text-stone-900 pb-4 border-b border-stone-200">
                      Tanlov xulosasi
                    </h3>

                    <dl className="mt-4 space-y-3 text-sm">
                      <div className="flex items-center justify-between gap-4">
                        <dt className="text-stone-500">Xizmat</dt>
                        <dd className="font-medium text-stone-900 text-right">
                          {selectedService ? selectedService.title : 'Tanlanmagan'}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <dt className="text-stone-500">Sana</dt>
                        <dd className="font-medium text-stone-900 tabular-nums text-right">
                          {formatUzbekDate(selectedDateIso)}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <dt className="text-stone-500">Vaqt</dt>
                        <dd className="font-mono font-medium text-stone-900 tabular-nums text-right">
                          {selectedTime ?? 'Tanlanmagan'}
                        </dd>
                      </div>
                      <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-4">
                        <dt className="text-stone-600 font-medium">Davomiyligi va narxi</dt>
                        <dd className="font-mono font-semibold text-stone-900 tabular-nums text-right">
                          {selectedService
                            ? `${selectedService.durationLabel} · ${selectedService.priceLabel}`
                            : '—'}
                        </dd>
                      </div>
                    </dl>

                    <button
                      type="submit"
                      className="mt-6 w-full h-12 px-6 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2"
                    >
                      <span>Yozilish</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </form>
            </section>
          </>
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer id="manzil" className="border-t border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="font-serif text-lg font-semibold text-stone-900">Usta</span>
            <p className="mt-1 text-sm text-stone-500">
              Erkaklar sartaroshxonasi · Har kuni 09:00 – 21:00
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-stone-600">
            <span className="inline-flex items-center gap-2">
              <MapPin className="w-4 h-4 text-stone-400" aria-hidden="true" />
              <span>Toshkent sh., Amir Temur shoh ko‘chasi 48</span>
            </span>
            <span className="inline-flex items-center gap-2 font-mono tabular-nums">
              <Phone className="w-4 h-4 text-stone-400" aria-hidden="true" />
              <span>+998 71 200 45 45</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
