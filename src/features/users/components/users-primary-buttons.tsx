import { MailPlus, Upload, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUsers } from './users-provider'

export function UsersPrimaryButtons() {
  const { setOpen } = useUsers()

  return (
    <div className='flex gap-2'>
      <Button variant='outline' onClick={() => setOpen('invite')}>
        <span>Invite User</span> <MailPlus size={18} />
      </Button>

      <Button variant='outline' onClick={() => setOpen('import')}>
        <span>Import</span> <Upload />
      </Button>

      <Button onClick={() => setOpen('add')}>
        <span>Add User</span> <UserPlus />
      </Button>
    </div>
  )
}
