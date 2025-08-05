import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"

import { useCreateCommentMutation } from "@/lib/queries"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

interface CommentFormProps {
  postId: number
}

const formSchema = z.object({
  content: z.string().min(1, "Comment content is required"),
})

export function CommentForm({ postId }: CommentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  })

  const createCommentMutation = useCreateCommentMutation()

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createCommentMutation.mutate(
      { postId, content: data.content },
      {
        onSuccess: () => {
          form.reset()
          toast.success("Comment added successfully!")
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : "Failed to add comment")
        },
      }
    )
  }

  return (
    <div className="mb-6 border-t pt-6">
      <h3 className="text-lg font-semibold mb-4">Add a Comment</h3>

      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            void form.handleSubmit(onSubmit)(e)
          }}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comment</FormLabel>
                <FormControl>
                  <Textarea placeholder="Write your comment here..." className="min-h-[100px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={createCommentMutation.isPending}>
            {createCommentMutation.isPending ? "Adding Comment..." : "Add Comment"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
