'use client';
import React, { useEffect, useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { nanoid } from 'nanoid';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


export default function UserSession() {
  const [user, setUser, { removeItem: removeUser }] = useLocalStorageState(`user`);
  const [name, setName] = useState('');
  const createUser = () => {
    const id = nanoid(10);
    setUser({ id, name });
  };
  // useEffect(() => {
  //   return () => removeUser();
  // }, []);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (isClient &&
    <Dialog open={!user}>
      {/* <DialogTrigger></DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Username?</DialogTitle>
          <DialogDescription>
            Please enter an alias for yourself to access games.
          </DialogDescription>
        </DialogHeader>
        <Input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
        <DialogFooter>
          <Button type="submit" onClick={createUser}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
