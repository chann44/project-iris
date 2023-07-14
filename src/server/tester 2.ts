import { prisma } from './db'

const main = async () => {
  const post = await prisma.user.create({
    data: {
      Email: "test@test.test",
      FirstName: "Test",
      LastName: "Tester",
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
      MaxWpm: 200,
      CurrentWpm: 200,
    }
  })
}

main()
  .catch(e => {
    console.log(e)
  })