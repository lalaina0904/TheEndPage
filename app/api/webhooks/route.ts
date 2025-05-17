import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import {prisma} from '@/lib/prismaClient'


export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)
    const { id } = evt.data
    const eventType = evt.type

    if (eventType === 'user.created') {
      // Appel à l’API Clerk pour obtenir les infos complètes
      const res = await fetch(`https://api.clerk.com/v1/users/${id}`, {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY!}`, // clé API secrète Clerk
        },
      })

      if (!res.ok) {
        console.error('❌ Erreur lors de la récupération du user depuis Clerk')
        return new Response('Erreur API Clerk', { status: 500 })
      }

      const user = await res.json()

      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email_addresses?.[0]?.email_address ?? '',
          name: `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim(),
          //pic: user.image_url,
        },
      })

      console.log(`✅ User ${user.id} créé dans la base.`)
    }

    return new Response('Webhook reçu', { status: 200 })
  } catch (err) {
    console.error('❌ Erreur lors du traitement du webhook:', err)
    return new Response('Erreur webhook', { status: 400 })
  }
}
