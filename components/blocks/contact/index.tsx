"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactConfig } from "./contact-config";

const formSchema = z.object({
  name: z.string().min(1, contactConfig.formFields.name.error),
  email: z.email(contactConfig.formFields.email.error),
  contactNumber: z
    .string()
    .min(1, contactConfig.formFields.contactNumber.error),
  subject: z.string().min(1, contactConfig.formFields.subject.error),
  message: z.string().min(1, contactConfig.formFields.message.error),
});

type FormData = z.infer<typeof formSchema>;

export const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      contactNumber: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          contactNumber: data.contactNumber,
          subject: data.subject,
          message: data.message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || contactConfig.messages.error);
      }

      toast.success(contactConfig.messages.success);
      form.reset();
    } catch (error) {
      console.error("Contact form submission error:", error);
      toast.error(
        error instanceof Error ? error.message : contactConfig.messages.error,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-10 md:py-24 bg-white">
      <div className="container px-4 md:px-6 lg:px-8">
        {/* Contact Method Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Send E-Mail Card */}
          <a
            href={`mailto:${contactConfig.contactMethods.email.value}`}
            className="bg-[#f8f8f8] rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left">
              <div className="w-16 h-16 rounded-sm bg-gray-200 flex items-center justify-center mb-4 md:mb-0 md:mr-4 flex-shrink-0">
                <Mail className="w-8 h-8 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {contactConfig.contactMethods.email.title}
                </h3>
                <p className="text-gray-700 break-words">
                  {contactConfig.contactMethods.email.value}
                </p>
              </div>
            </div>
          </a>

          {/* Call Anytime Card */}
          <a
            href={`tel:${contactConfig.contactMethods.phone.value.replace(/\s/g, "")}`}
            className="bg-[#f8f8f8] rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left">
              <div className="w-16 h-16 rounded-sm bg-[#f7931e] flex items-center justify-center mb-4 md:mb-0 md:mr-4 flex-shrink-0">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {contactConfig.contactMethods.phone.title}
                </h3>
                <p className="text-gray-700 break-words">
                  {contactConfig.contactMethods.phone.value}
                </p>
              </div>
            </div>
          </a>

          {/* Whatsapp Card */}
          <a
            href={`https://wa.me/${contactConfig.contactMethods.whatsapp.value.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#f8f8f8] rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left">
              <div className="w-16 h-16 rounded-sm bg-gray-200 flex items-center justify-center mb-4 md:mb-0 md:mr-4 flex-shrink-0">
                <FaWhatsapp className="w-8 h-8 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {contactConfig.contactMethods.whatsapp.title}
                </h3>
                <p className="text-gray-700 break-words">
                  {contactConfig.contactMethods.whatsapp.value}
                </p>
              </div>
            </div>
          </a>
        </div>

        {/* Contact Form */}
        <div className="bg-[#f8f8f8] rounded-sm p-6 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            {contactConfig.formTitle}
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* First Row - Two Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900">
                        {contactConfig.formFields.name.label}{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            contactConfig.formFields.name.placeholder
                          }
                          className="bg-white border-gray-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900">
                        {contactConfig.formFields.email.label}{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={
                            contactConfig.formFields.email.placeholder
                          }
                          className="bg-white border-gray-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Second Row - Two Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900">
                        {contactConfig.formFields.contactNumber.label}{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            contactConfig.formFields.contactNumber.placeholder
                          }
                          className="bg-white border-gray-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900">
                        {contactConfig.formFields.subject.label}{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            contactConfig.formFields.subject.placeholder
                          }
                          className="bg-white border-gray-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Third Row - Message Textarea */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900">
                      {contactConfig.formFields.message.label}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={
                          contactConfig.formFields.message.placeholder
                        }
                        rows={6}
                        className="bg-white border-gray-300"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#f7931e] hover:bg-[#f7931e]/90 text-white px-8 py-2 rounded-md"
              >
                {isSubmitting
                  ? contactConfig.button.submitting
                  : contactConfig.button.submit}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};
