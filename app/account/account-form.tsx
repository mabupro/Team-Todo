'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { type User } from '@supabase/supabase-js';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AccountFormProps {
  user: User | null;
}

export default function AccountForm({ user }: AccountFormProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [fullname, setFullname] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  const getProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select('full_name, username, website, avatar_url')
        .eq('id', user?.id)
        .single();

      if (error && status !== 406) {
        console.error(error);
      } else if (data) {
        setFullname(data.full_name ?? '');
        setUsername(data.username ?? '');
        setWebsite(data.website ?? '');
        setAvatarUrl(data.avatar_url ?? '');
      }
    } catch {
      alert('Error loading user data');
    } finally {
      setLoading(false);
    }
  }, [supabase, user?.id]);

  useEffect(() => {
    if (user) getProfile();
  }, [user, getProfile]);

  const updateProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        full_name: fullname,
        username,
        website,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert('Profile updated!');
    } catch {
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>アカウント設定</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="text" value={user?.email ?? ''} disabled />
          </div>
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          disabled={loading}
        >
          リセット
        </Button>
        <Button onClick={updateProfile} disabled={loading}>
          {loading ? '読み込み中...' : '更新する'}
        </Button>
      </CardFooter>
      <CardFooter className="justify-center">
        <form action="/auth/signout" method="post">
          <Button variant="ghost">サインアウト</Button>
        </form>
      </CardFooter>
    </Card>
  );
}
