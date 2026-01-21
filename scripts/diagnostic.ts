import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const storeId = 'cmkmexssf0002v2jcp8wghczv'
    const productId = 'cmkmgm7sa0007v2jcngrz1jgq'

    console.log('--- DIAGNOSTIC START ---')

    const store = await prisma.store.findUnique({
        where: { id: storeId },
    })
    console.log('Store:', store ? `${store.name} (${store.id})` : 'NOT FOUND')

    const product = await prisma.product.findUnique({
        where: { id: productId },
    })
    console.log('Product:', product ? `${product.name} (${product.id})` : 'NOT FOUND')

    const storeProductById = await prisma.storeProduct.findFirst({
        where: { productId: productId },
        include: { store: true }
    })
    if (storeProductById) {
        console.log(`Found StoreProduct for this product in store: ${storeProductById.store.name} (${storeProductById.storeId})`)
    } else {
        console.log('No StoreProduct found for this product in ANY store.')
    }

    const storeProductLink = await prisma.storeProduct.findUnique({
        where: {
            storeId_productId: {
                storeId,
                productId
            }
        }
    })
    console.log('Direct store-product link:', storeProductLink ? 'EXISTS' : 'NOT FOUND')

    console.log('--- DIAGNOSTIC END ---')
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
