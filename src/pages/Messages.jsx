import { MessageCircle } from 'lucide-react';

export default function Messages() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 gap-3">
      <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-500">
        <MessageCircle size={26} />
      </div>
      <p className="text-ink font-medium">No messages yet</p>
      <p className="text-slate-500 text-sm max-w-xs">
        System notifications and approvals will show up here once they arrive.
      </p>
    </div>
  );
}
