import { useForm } from "react-hook-form"

import { useCreateCommentMutation } from "@/lib/queries"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

interface CommentFormProps {
  postId: number
}

interface CommentFormData {
  content: string
}

export function CommentForm({ postId }: CommentFormProps) {
  const form = useForm<CommentFormData>({
    defaultValues: {
      content: "",
    },
  })

  const createCommentMutation = useCreateCommentMutation()

  const onSubmit = (data: CommentFormData) => {
    createCommentMutation.mutate(
      { postId, content: data.content },
      {
        onSuccess: () => {
          form.reset()
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
            rules={{
              required: "Comment content is required",
              minLength: { value: 1, message: "Comment cannot be empty" },
            }}
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
