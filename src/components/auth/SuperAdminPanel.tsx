
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, CheckCircle, XCircle, AlertCircle, Users, Shield, Database } from 'lucide-react';

interface AuthorizedEmail {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
  authorized_by: string | null;
}

interface Profile {
  id: string;
  email: string;
  role: 'superadmin' | 'service_center';
  created_at: string;
}

const SuperAdminPanel = () => {
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const queryClient = useQueryClient();

  // Fetch authorized emails
  const { data: authorizedEmails = [], isLoading: emailsLoading } = useQuery({
    queryKey: ['authorized-emails'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('authorized_emails')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as AuthorizedEmail[];
    },
  });

  // Fetch user profiles
  const { data: profiles = [], isLoading: profilesLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Profile[];
    },
  });

  // Add authorized email mutation
  const addEmailMutation = useMutation({
    mutationFn: async (email: string) => {
      const { data, error } = await supabase
        .from('authorized_emails')
        .insert([{ email, is_active: true }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authorized-emails'] });
      setNewEmail('');
      setMessage('Email authorized successfully!');
      setError('');
    },
    onError: (error: any) => {
      setError(error.message);
      setMessage('');
    },
  });

  // Toggle email status mutation
  const toggleEmailMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { data, error } = await supabase
        .from('authorized_emails')
        .update({ is_active })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authorized-emails'] });
      setMessage('Email status updated successfully!');
      setError('');
    },
    onError: (error: any) => {
      setError(error.message);
      setMessage('');
    },
  });

  // Delete email mutation
  const deleteEmailMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('authorized_emails')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authorized-emails'] });
      setMessage('Email removed successfully!');
      setError('');
    },
    onError: (error: any) => {
      setError(error.message);
      setMessage('');
    },
  });

  const handleAddEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) {
      setError('Please enter a valid email address');
      return;
    }
    addEmailMutation.mutate(newEmail.trim());
  };

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    toggleEmailMutation.mutate({ id, is_active: !currentStatus });
  };

  const handleDeleteEmail = (id: string) => {
    if (confirm('Are you sure you want to remove this email authorization?')) {
      deleteEmailMutation.mutate(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Authorized</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{authorizedEmails.length}</div>
            <p className="text-xs text-muted-foreground">Authorized email addresses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{authorizedEmails.filter(e => e.is_active).length}</div>
            <p className="text-xs text-muted-foreground">Currently active emails</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profiles.length}</div>
            <p className="text-xs text-muted-foreground">Users with accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs Interface */}
      <Tabs defaultValue="authorize" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="authorize" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Authorize Email
          </TabsTrigger>
          <TabsTrigger value="emails" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Authorized Emails
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Registered Users
          </TabsTrigger>
        </TabsList>

        {/* Authorize New Email Tab */}
        <TabsContent value="authorize">
          <Card>
            <CardHeader>
              <CardTitle>Authorize New Email</CardTitle>
              <CardDescription>Add a new email address that can create an account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddEmail} className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div className="flex items-end">
                  <Button type="submit" disabled={addEmailMutation.isPending}>
                    <Plus className="h-4 w-4 mr-2" />
                    {addEmailMutation.isPending ? 'Adding...' : 'Add Email'}
                  </Button>
                </div>
              </form>
              
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {message && (
                <Alert className="mt-4">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Authorized Emails Tab */}
        <TabsContent value="emails">
          <Card>
            <CardHeader>
              <CardTitle>Authorized Emails</CardTitle>
              <CardDescription>Manage email addresses that can create accounts</CardDescription>
            </CardHeader>
            <CardContent>
              {emailsLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Added</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {authorizedEmails.map((email) => (
                      <TableRow key={email.id}>
                        <TableCell className="font-medium">{email.email}</TableCell>
                        <TableCell>
                          <Badge variant={email.is_active ? "default" : "secondary"}>
                            {email.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(email.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleStatus(email.id, email.is_active)}
                              disabled={toggleEmailMutation.isPending}
                            >
                              {email.is_active ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteEmail(email.id)}
                              disabled={deleteEmailMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Registered Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Registered Users</CardTitle>
              <CardDescription>Users who have created accounts</CardDescription>
            </CardHeader>
            <CardContent>
              {profilesLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Registered</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell className="font-medium">{profile.email}</TableCell>
                        <TableCell>
                          <Badge variant={profile.role === "superadmin" ? "default" : "secondary"}>
                            {profile.role === "superadmin" ? "Super Admin" : "Service Center"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(profile.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminPanel;
