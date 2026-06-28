'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isSupabaseConfigured } from "@/lib/db";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          // Fallback to local admin credential if Supabase Auth has no registered user matching the request
          if (email === "admin@batimawad.com" && password === "admin123") {
            localStorage.setItem("batimawad_admin_session", "mock_active_session");
            router.push("/admin");
            return;
          }
          throw authError;
        }

        localStorage.setItem("batimawad_admin_session", "supabase_active_session");
        router.push("/admin");
      } catch (err: any) {
        setError(err.message || "Erreur de connexion.");
        setLoading(false);
      }
    } else {
      // Mock Login Mode
      setTimeout(() => {
        if (email === "admin@batimawad.com" && password === "admin123") {
          localStorage.setItem("batimawad_admin_session", "mock_active_session");
          router.push("/admin");
        } else {
          setError("Identifiants incorrects (Mode Test : admin@batimawad.com / admin123).");
          setLoading(false);
        }
      }, 800);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-primary/10 blur-[80px]" />
      <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] translate-x-1/2 rounded-full bg-accent/10 blur-[80px]" />

      <Card className="w-full max-w-md border-border/40 bg-card/60 backdrop-blur-md relative z-10">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-white rounded-xl p-2 border border-border/10 shadow-lg shadow-black/5">
            <img
              src="/logo.png"
              alt="Bati Mawad Logo"
              className="h-12 w-auto object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            Espace Administrateur
          </CardTitle>
          <CardDescription>
            Connectez-vous pour gérer les commandes de Batim Awad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Adresse e-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@batimawad.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-primary text-primary-foreground hover:bg-safety-yellow-hover py-2.5 font-semibold transition-all hover:shadow-lg hover:shadow-primary/10"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Connexion...
                </div>
              ) : (
                "Se connecter"
              )}
            </Button>

            {!isSupabaseConfigured() && (
              <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground text-center">
                <p className="font-semibold text-primary mb-1">💡 Mode Démonstration Actif</p>
                <p>Utilisez : <span className="font-mono text-foreground font-medium">admin@batimawad.com</span> et <span className="font-mono text-foreground font-medium">admin123</span></p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
