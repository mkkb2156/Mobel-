'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: '弱', color: 'bg-error' };
  if (score <= 3) return { score, label: '中等', color: 'bg-amber-500' };
  return { score, label: '強', color: 'bg-success' };
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordStrength = useMemo(
    () => getPasswordStrength(formData.password),
    [formData.password]
  );

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('密碼與確認密碼不一致。');
      return;
    }

    if (formData.password.length < 8) {
      setError('密碼至少需要 8 個字元。');
      return;
    }

    if (!agreed) {
      setError('請先同意服務條款與隱私權政策。');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            phone: formData.phone || undefined,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      router.push('/account');
    } catch {
      setError('註冊時發生錯誤，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google') => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/account`,
      },
    });
  };

  const handleLineLogin = () => {
    window.location.href = '/api/auth/line';
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="font-serif text-4xl font-bold tracking-wider text-charcoal">
              MOBEL
            </h1>
          </Link>
          <p className="mt-2 text-sm text-walnut/70">
            加入 MOBEL，探索歐洲古董家具之美
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          {error && (
            <div className="border border-error/20 bg-red-50 px-4 py-3 text-sm text-error">
              {error}
            </div>
          )}

          <Input
            id="name"
            label="姓名"
            type="text"
            placeholder="您的姓名"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            required
          />

          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            required
          />

          <Input
            id="phone"
            label="電話（選填）"
            type="tel"
            placeholder="09XX-XXX-XXX"
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
          />

          <div>
            <Input
              id="password"
              label="密碼"
              type="password"
              placeholder="至少 8 個字元"
              value={formData.password}
              onChange={(e) => updateField('password', e.target.value)}
              required
            />
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex flex-1 gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i < passwordStrength.score
                            ? passwordStrength.color
                            : 'bg-linen'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-walnut/60">
                    {passwordStrength.label}
                  </span>
                </div>
              </div>
            )}
          </div>

          <Input
            id="confirmPassword"
            label="確認密碼"
            type="password"
            placeholder="再次輸入密碼"
            value={formData.confirmPassword}
            onChange={(e) => updateField('confirmPassword', e.target.value)}
            error={
              formData.confirmPassword &&
              formData.password !== formData.confirmPassword
                ? '密碼不一致'
                : undefined
            }
            required
          />

          {/* Terms checkbox */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 border-linen accent-brass"
            />
            <span className="text-sm text-walnut/70">
              我同意{' '}
              <Link
                href="/terms"
                className="text-brass hover:text-brass-dark underline"
              >
                服務條款
              </Link>
              與
              <Link
                href="/privacy"
                className="text-brass hover:text-brass-dark underline"
              >
                隱私權政策
              </Link>
            </span>
          </label>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
            size="lg"
          >
            建立帳號
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-linen" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-cream px-4 text-sm text-walnut/50">或</span>
          </div>
        </div>

        {/* Social Login */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => handleOAuthLogin('google')}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            使用 Google 登入
          </Button>

          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={handleLineLogin}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#06C755">
              <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738S0 4.935 0 10.304c0 4.814 4.27 8.846 10.035 9.608.391.084.922.258 1.057.592.121.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967C23.309 14.094 24 12.313 24 10.304zM8.047 13.118H6.078a.588.588 0 0 1-.588-.587V8.572a.588.588 0 0 1 1.176 0v3.371h1.381a.588.588 0 0 1 0 1.175zm1.96-.587a.588.588 0 0 1-1.176 0V8.572a.588.588 0 0 1 1.176 0v3.959zm5.023 0a.588.588 0 0 1-1.07.336l-2.021-2.749v2.413a.588.588 0 0 1-1.176 0V8.572a.588.588 0 0 1 1.07-.336l2.021 2.749V8.572a.588.588 0 0 1 1.176 0v3.959zm3.483-2.784a.588.588 0 0 1 0 1.176h-1.381v.82h1.381a.588.588 0 0 1 0 1.175h-1.969a.588.588 0 0 1-.588-.587V8.572a.588.588 0 0 1 .588-.588h1.969a.588.588 0 0 1 0 1.176h-1.381v.587h1.381z" />
            </svg>
            使用 LINE 登入
          </Button>
        </div>

        {/* Login link */}
        <p className="mt-8 text-center text-sm text-walnut/70">
          已有帳號？{' '}
          <Link
            href="/auth/login"
            className="font-medium text-brass hover:text-brass-dark transition-colors"
          >
            立即登入
          </Link>
        </p>
      </div>
    </div>
  );
}
