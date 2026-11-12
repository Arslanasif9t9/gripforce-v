-- 0001: let guests (not signed in) send support messages from the Contact page.
-- Run in: Lovable > Cloud > SQL editor, BEFORE pushing the code that uses it.
-- Safe to run once. Existing rows are not changed.

-- 1) A guest has no user id.
ALTER TABLE public.support_messages ALTER COLUMN user_id DROP NOT NULL;

-- 2) Basic size limits (stops huge spam messages).
ALTER TABLE public.support_messages
  ADD CONSTRAINT support_messages_length_check CHECK (
    char_length(customer_name) BETWEEN 1 AND 120
    AND char_length(customer_email) BETWEEN 3 AND 254
    AND char_length(subject) BETWEEN 1 AND 200
    AND char_length(message) BETWEEN 1 AND 5000
  );

-- 3) Guests may only INSERT (never read). New messages must start as 'open'.
GRANT INSERT ON public.support_messages TO anon;
CREATE POLICY "Guests can submit support messages" ON public.support_messages
  FOR INSERT TO anon WITH CHECK (user_id IS NULL AND status = 'open');

-- 4) Signed-in customers: same rule, new messages must start as 'open'.
DROP POLICY "Customers can submit support messages" ON public.support_messages;
CREATE POLICY "Customers can submit support messages" ON public.support_messages
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND status = 'open');
