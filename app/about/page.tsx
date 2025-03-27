"use client";

import Image from "next/image"
import { ArrowRight, Mail, MapPin, Phone, PenToolIcon as Tool, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Hero Section */}
      <section className="mb-20">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Unsere Geschichte</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Wir verbinden talentierte Handwerker mit den Menschen, die sie wirklich brauchen.
            </p>
            <div className="flex gap-4">
              <Button size="lg" onClick={() => router.push("/")}>
                Handwerker finden <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => router.push("/create-profile")}>
                Als Handwerker beitreten
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden">
            <Image
              src="/assets/images/about.png"
              alt="Handwerker bei der Arbeit"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="mb-20">
        <div className="grid md:grid-cols-2 bg-muted p-8 gap-8 rounded-xl">
          <div>
            <h2 className="text-3xl font-bold mb-6">Das Problem, das wir lösen</h2>
            <div>
              <p className="text-lg mb-4">
                In unserer schnellen Welt ist es oft überraschend schwer, gute Handwerker zu finden – besonders wenn es
                dringend ist. Hausverwaltungen und Eigentümer tun sich schwer, zuverlässige Profis mit den passenden
                Fähigkeiten zu finden.
              </p>
              <p className="text-lg">
                Gleichzeitig sind viele talentierte Handwerker auf Mundpropaganda angewiesen, um neue Aufträge zu
                bekommen. Das limitiert ihr Wachstum und macht vieles komplizierter als nötig.
              </p>
            </div>
          </div>
          <div className="relative  rounded-lg overflow-hidden">
            <Image
              src="/assets/images/test.png"
              alt="Illustration des Problems"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-10 text-center">Die Gründer</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="flex flex-col items-center text-center">
            <div className="relative h-[200px] w-[200px] rounded-full overflow-hidden mb-6">
              <Image src="/assets/images/matteo_golisano.avif" alt="Matteo Golisano" fill className="object-cover" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Matteo Golisano</h3>
            <p className="text-muted-foreground mb-4">Co-Founder, 23</p>
            <p className="max-w-md">
              Als gelernter Schreiner kennt Matteo die Herausforderungen im Handwerk aus erster Hand. Sein Know-how und
              seine Erfahrung sind die Basis für viele Funktionen unserer Plattform.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="relative h-[200px] w-[200px] rounded-full overflow-hidden mb-6">
              <Image src="/assets/images/linus_weigand.png" alt="Linus Weigand" fill className="object-cover" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Linus Weigand</h3>
            <p className="text-muted-foreground mb-4">Co-Founder, 22</p>
            <p className="max-w-md">
              Linus bringt seine Leidenschaft für Technik und clevere Lösungen mit ein – und sorgt dafür, dass unsere
              Plattform technisch reibungslos funktioniert und Handwerker mit Kunden verbindet.
            </p>
          </div>
        </div>
      </section>

      {/* Our Solution Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-10">Unsere Lösung</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-xl shadow-sm">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Tool className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Handwerker-Profile</h3>
            <p>
              Handwerker erstellen aussagekräftige Profile mit Infos zu Erfahrung, Fähigkeiten und bisherigen Projekten
              – und zeigen, was sie besonders gut können.
            </p>
          </div>
          <div className="bg-card p-6 rounded-xl shadow-sm">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Suche nach Standort</h3>
            <p>
              Kunden finden gezielt Handwerker in ihrer Nähe – mit genau den Fähigkeiten, die gebraucht werden. Schnell,
              einfach und passend.
            </p>
          </div>
          <div className="bg-card p-6 rounded-xl shadow-sm">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Direkter Kontakt</h3>
            <p>
              Unsere Plattform ermöglicht direkten Austausch – ohne Umwege. Das spart Zeit und erleichtert die Planung
              und Umsetzung.
            </p>
          </div>
        </div>
      </section>

      {/* Origin Story Section */}
      <section className="mb-20">
        <div className="bg-card p-8 rounded-xl border">
          <h2 className="text-3xl font-bold mb-6">Wie alles begann</h2>
          <p className="text-lg mb-4">
            Die Idee entstand in München. Matteo, damals als Schreiner tätig, merkte schnell: Gute Handwerker zu finden
            ist schwer – auch im digitalen Zeitalter. Vieles lief immer noch über Empfehlungen.
          </p>
          <p className="text-lg mb-4">
            Er sprach mit seinem Freund Linus darüber – und gemeinsam erkannten sie die Chance, etwas zu verändern. Eine
            Plattform, die Handwerk und Digitalisierung sinnvoll verbindet.
          </p>
          <p className="text-lg">
            Mit 22 und 23 Jahren wagten sie den Schritt in die Selbstständigkeit. Matteo brachte die Branchenerfahrung,
            Linus das Tech-Wissen – zusammen bauen sie eine Lösung, die wirklich hilft.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section>
        <h2 className="text-3xl font-bold mb-10 text-center">Kontakt aufnehmen</h2>
        <div className="max-w-2xl mx-auto bg-card p-8 rounded-xl border">
          <div className="grid gap-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">E-Mail</h3>
                <p className="text-muted-foreground">kontakt@mano.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Telefon</h3>
                <p className="text-muted-foreground">+49 123 456 7890</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Standort</h3>
                <p className="text-muted-foreground">München, Deutschland</p>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <Button className="w-full">Jetzt kontaktieren</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
