'use client';

import z from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { motion } from 'framer-motion';

const formSchema = z.object({
    email: z.string().email({ message: 'Email invalide' }),
    name: z.string().min(1, { message: 'Nom requis' }),
    message: z.string().min(1, { message: 'Le message ne peut pas être vide' }),
});

const Contact = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            name: '',
            message: '',
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        toast.success('Message envoyé', {
            description:
                'Merci pour votre message ! Nous vous répondrons bientôt.',
        });
        form.reset();
        console.log(values);
    };

    return (
        <div className="container mx-auto mt-16">
            <div className="mb-20">
                <div className="flex flex-wrap">
                    {/* Texte à gauche */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="mb-10 w-full md:w-6/12 px-3 lg:px-6">
                        <h2 className="font-bold mb-6 text-3xl">
                            Contactez-nous
                        </h2>
                        <div className="mb-6">
                            <p className="mb-3 font-semibold">
                                On aimerait entendre vos feedback!
                            </p>
                            <p>
                                Une question, une suggestion ou une demande ?
                                N'hésitez pas à nous écrire. Notre équipe est là
                                pour vous aider.
                            </p>
                        </div>
                        <p className="mb-2 text-foreground/60">
                            Antananarivo, 101, Madagascar
                        </p>
                        <p className="mb-2 text-foreground/60">
                            +261 34 49 000 00
                        </p>
                        <p className="mb-2 text-foreground/60">
                            bisounours@outlook.com
                        </p>
                    </motion.div>

                    {/* Formulaire à droite */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mb-12 w-full md:w-6/12 px-3 lg:px-6">
                        <Form {...form}>
                            <motion.form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="theo@gmail.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nom</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Théo"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Message</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Écrivez votre message..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button className="w-full" type="submit">
                                    Envoyer
                                </Button>
                            </motion.form>
                        </Form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
