// Types
export type User = {
  id: string
  name: string
  email: string
  image?: string | null
  bio?: string | null
  role: 'STUDENT' | 'TEACHER'
  class?: string | null
  createdAt: Date
  updatedAt: Date
}

export type Rating = {
  id: string
  stars: number
  comment?: string | null
  createdAt: Date
  giverId: string
  receiverId: string
}

// In-memory store
class Store {
  private users: Map<string, User> = new Map()
  private ratings: Map<string, Rating> = new Map()
  private emailToId: Map<string, string> = new Map()

  constructor() {
    this.initializeTestData()
  }

  private initializeTestData() {
    // Helper function to generate random ratings
    const generateRandomRating = (giverId: string, receiverId: string) => {
      // Generate a random number between 1-5 with a slight bias towards middle ratings
      const random = Math.random()
      let stars
      if (random < 0.1) { // 10% chance of 1 star
        stars = 1
      } else if (random < 0.25) { // 15% chance of 2 stars
        stars = 2
      } else if (random < 0.55) { // 30% chance of 3 stars
        stars = 3
      } else if (random < 0.85) { // 30% chance of 4 stars
        stars = 4
      } else { // 15% chance of 5 stars
        stars = 5
      }
      const comments = {
        1: [
          'Eats super crunchy chips during presentations',
          'Types really loud on their mechanical keyboard',
          'Always shows up drinking a super smelly protein shake',
          'Uses Comic Sans in all their presentations',
          'Takes forever to respond to messages but posts memes all day',
          'Keeps using outdated memes in presentations',
          'Always uses reaction GIFs in work chat',
          'Eats a stinky burger during class',
          'Listens to music way too loud through headphones',
          'Always leaves their empty coffee cups everywhere',
          'Chews gum really loudly during meetings',
          'Taps their pen constantly during discussions',
          'Always has their phone notifications on max volume',
          'Wears really strong perfume that gives me a headache',
          'Takes up too much space in the study area',
          'Always interrupts others to tell unrelated stories',
          'Keeps humming under their breath during quiet work time',
          'Has a really annoying ringtone',
          'Always leaves their laptop charger plugged in when not using it',
          'Takes too many bathroom breaks during group work',
          'Never showers after gym class',
          'Always has their feet up on the desk',
          'Keeps playing TikTok videos without headphones',
          'Always has their camera off in meetings',
          'Takes up the entire whiteboard with terrible handwriting'
        ],
        2: [
          'Could improve time management',
          'Sometimes misses deadlines',
          'Needs to work on communication',
          'Could be more organized',
          'Should participate more in discussions',
          'Needs to improve documentation',
          'Could be more proactive',
          'Should work on presentation skills',
          'Needs to be more detail-oriented',
          'Could improve code quality',
          'Often late to meetings',
          'Doesn\'t follow project guidelines',
          'Poor at responding to emails',
          'Needs to improve teamwork',
          'Could be more reliable',
          'Should improve code documentation',
          'Needs to work on punctuality',
          'Could be more focused in meetings',
          'Should improve problem-solving skills',
          'Needs to work on time management',
          'Frequently submits work late',
          'Poor attendance record',
          'Often unprepared for meetings',
          'Doesn\'t contribute to group discussions',
          'Regularly misses important deadlines'
        ],
        3: [
          'Brings amazing cookies to study sessions',
          'Has the coolest laptop stickers',
          'Always shares their snacks',
          'Makes great coffee for the team',
          'Has a really nice handwriting',
          'Wears awesome tech-themed t-shirts',
          'Shares great memes in the group chat',
          'Has a really cool desk setup',
          'Always has gum to share',
          'Makes the best study playlist',
          'Good at basic tasks',
          'Generally reliable',
          'Does the minimum required',
          'Punctual most of the time',
          'Adequate communication skills',
          'Basic problem-solving abilities',
          'Fair team player',
          'Generally organized',
          'Basic presentation skills',
          'Acceptable work quality',
          'Usually meets deadlines',
          'Participates occasionally',
          'Decent code quality',
          'Generally helpful',
          'Average problem-solving skills'
        ],
        4: [
          'Great team player!',
          'Always helpful in group discussions',
          'Excellent communication skills',
          'Very reliable and punctual',
          'Strong problem-solving abilities',
          'Great at explaining concepts',
          'Very organized and efficient',
          'Excellent leadership qualities',
          'Always prepared for meetings',
          'Great attention to detail',
          'Outstanding presentation skills',
          'Very creative in finding solutions',
          'Excellent time management',
          'Great at debugging complex issues',
          'Very thorough in documentation',
          'Excellent at mentoring others',
          'Great at handling pressure',
          'Very innovative in approach',
          'Excellent at code review',
          'Great at project planning',
          'Consistently delivers high-quality work',
          'Strong analytical skills',
          'Great at team coordination',
          'Excellent problem-solving approach',
          'Very professional in all interactions'
        ],
        5: [
          'Exceptional team player who goes above and beyond',
          'Outstanding leadership and mentoring abilities',
          'Incredible problem-solving skills and innovative solutions',
          'Perfect communication and presentation skills',
          'Remarkable ability to handle complex projects',
          'Extraordinary attention to detail and organization',
          'Exceptional time management and reliability',
          'Outstanding technical expertise and knowledge',
          'Incredible ability to motivate and inspire others',
          'Perfect balance of technical and soft skills',
          'Exceptional at handling high-pressure situations',
          'Outstanding ability to learn and adapt quickly',
          'Remarkable project planning and execution',
          'Extraordinary debugging and troubleshooting skills',
          'Perfect documentation and knowledge sharing',
          'Exceptional at cross-team collaboration',
          'Outstanding ability to identify and solve problems',
          'Incredible attention to code quality and best practices',
          'Perfect balance of creativity and technical skills',
          'Exceptional at mentoring and helping others grow',
          'Absolutely brilliant problem solver',
          'Incredible work ethic and dedication',
          'Outstanding ability to lead by example',
          'Exceptional at handling complex challenges',
          'Perfect combination of technical and interpersonal skills'
        ]
      }
      const comment = comments[stars as keyof typeof comments][Math.floor(Math.random() * comments[stars as keyof typeof comments].length)]
      
      // Generate a random date within the last 6 months
      const now = new Date()
      const sixMonthsAgo = new Date(now.getTime() - (180 * 24 * 60 * 60 * 1000)) // 180 days ago
      const randomDate = new Date(sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime()))
      
      return {
        giverId,
        receiverId,
        stars,
        comment,
        comments, // Return the comments object for reuse
        createdAt: randomDate // Add the random date
      }
    }

    // Create teachers
    const teacherData = [
      {
        name: 'M. van Noordenne',
        email: 'vannoordenne@university.edu',
        bio: 'AI researcher turned educator, passionate about ethical tech, creative coding, and critical design. When not teaching, I build provocatypes, spin dark jungle music, or run experiments on the edges of art and AI. Speaker, studio lead, and forever chasing strange questions.',
        role: 'TEACHER' as const,
        class: 'DT101',
        image: 'https://api.dicebear.com/7.x/rings/svg?seed=ProfessorVanNoordenne&backgroundColor=4a90e2&textureColor=000000'
      },
      {
        name: 'J. Friederichs',
        email: 'friederichs@university.edu',
        bio: 'Design researcher turned educator, questioning what makes us human in a tech-driven world. Through critical making and storytelling, I craft interventions that reflect on our digital behaviors. When not teaching, I explore the intersections of fashion, ethics, and technology—always seeking to make the complex approachable.',
        role: 'TEACHER' as const,
        class: 'DT102',
        image: 'https://api.dicebear.com/7.x/rings/svg?seed=ProfessorFriederichs&backgroundColor=4a90e2&textureColor=000000'
      },
      {
        name: 'D. van Beek',
        email: 'vanbeek@university.edu',
        bio: 'Creative technologist and educator, passionate about blending art, code, and human-centered design. I build immersive experiences that challenge perceptions and inspire innovation. When I\'m not teaching, I\'m exploring new ways to bridge the gap between technology and human experience, always focused on inclusion and accessibility.',
        role: 'TEACHER' as const,
        class: 'DT103',
        image: 'https://api.dicebear.com/7.x/rings/svg?seed=ProfessorVanBeek&backgroundColor=4a90e2&textureColor=000000'
      }
    ]

    // Create students for each class with realistic names
    const classes = ['DT101', 'DT102', 'DT103']
    const studentsPerClass = 10

    const studentNames = {
      DT101: [
        'Sophie de Vries', 'Lars Jansen', 'Yuki Tanaka', 'Mohammed Ahmed', 'Emma van der Berg',
        'Ravi Patel', 'Luna Santos', 'Thomas Müller', 'Aisha Khan', 'Daan Bakker'
      ],
      DT102: [
        'Felix Schmidt', 'Zara Ali', 'Lucas van Dijk', 'Sofia Rodriguez', 'Jan de Boer',
        'Maya Patel', 'Oliver Brown', 'Lina Chen', 'Max Weber', 'Amira Hassan'
      ],
      DT103: [
        'Bram Visser', 'Isabella Silva', 'Arun Kumar', 'Lisa van der Meer', 'Rafael Santos',
        'Nina Popov', 'Kai Chen', 'Anna Schmidt', 'Yusuf Yilmaz', 'Eva de Jong'
      ]
    }

    const studentBios = {
      DT101: [
        'Known for my collection of mechanical keyboards and custom keycaps. Love building indie games and contributing to open-source projects. When not coding, you\'ll find me playing chess or practicing guitar. Always have a stash of energy drinks in my backpack.',
        'Former competitive gamer turned software developer. Known for my collection of gaming peripherals and my ability to debug code at 3 AM. Love organizing LAN parties and sharing my favorite gaming snacks.',
        'Started a tech blog in high school that now has 50k followers. Love cooking and sharing my experiments with classmates. Known for my detailed project documentation and love of bubble tea.',
        'Built my first computer at 14 and haven\'t stopped tinkering since. Active in the robotics club and love mentoring younger students. Known for my collection of vintage tech and love of spicy food.',
        'Started a successful tech YouTube channel in high school. Known for my detailed study notes and love of bubble tea. Always have a camera ready to document my coding adventures.',
        'Won several hackathons in high school. Love playing cricket and organizing coding workshops. Known for my collection of programming books and love of spicy snacks.',
        'Created several apps that have been featured on the App Store. Love photography and street food. Known for my colorful coding setup and collection of tech gadgets.',
        'Learned to code through online courses. Active in the tech community. Known for my colorful coding setup and love of spicy food. Always have a stash of snacks in my desk.',
        'Love combining art and technology. Known for my creative project presentations and collection of tech-themed art. Always have a sketchbook ready for UI/UX ideas.',
        'Built a successful e-commerce website in high school. Love playing basketball and organizing tech meetups. Known for my collection of tech conference badges.'
      ],
      DT102: [
        'Started a cybersecurity club in high school. Known for my detailed security reports and love of Irish coffee. Always have a collection of lockpicking tools in my bag.',
        'Won several data visualization competitions. Love playing badminton and organizing data science workshops. Known for my collection of data visualization books.',
        'Built several successful web applications. Known for my entrepreneurial spirit and love of spicy food. Always have a whiteboard ready for brainstorming.',
        'Interned at AWS last summer. Love playing Starcraft and organizing cloud computing workshops. Known for my collection of cloud service stickers.',
        'Built several IoT devices. Known for my innovative projects and love of jazz music. Always have a soldering iron ready for quick fixes.',
        'Started coding at 8. Created several educational games. Love playing rugby and organizing coding competitions. Known for my collection of retro games.',
        'Started a crypto mining operation in high school. Known for my detailed technical documentation. Always have a calculator ready for crypto calculations.',
        'Built several award-winning robots. Love playing Go and organizing robotics workshops. Known for my collection of robot parts and tools.',
        'Created several successful mobile apps. Known for my efficient coding style and love of beer. Always have a collection of programming books.',
        'Won several game design competitions. Love playing soccer and organizing game jams. Known for my collection of game design books and sketches.'
      ],
      DT103: [
        'Created several award-winning app interfaces. Known for my minimalist design aesthetic and love of fika. Always have a collection of design books.',
        'Built several successful web applications. Love playing cricket and organizing tech workshops. Known for my collection of programming books.',
        'Won several AI competitions. Known for my detailed research papers and love of K-pop. Always have a collection of AI conference badges.',
        'Created several successful digital products. Love playing table tennis and organizing design workshops. Known for my collection of design tools.',
        'Built several successful startups. Known for my entrepreneurial spirit and love of tea. Always have a collection of business books.',
        'Created several apps with millions of downloads. Love playing chess and organizing coding workshops. Known for my collection of programming books.',
        'Won several CTF competitions. Known for my detailed security reports and love of pho. Always have a collection of security tools.',
        'Built several successful web applications. Love playing soccer and organizing tech meetups. Known for my collection of tech conference badges.',
        'Created several award-winning robots. Known for my innovative projects and love of anime. Always have a collection of robot parts.',
        'Built several successful data science projects. Love playing chess and organizing math workshops. Known for my collection of data science books.'
      ]
    }

    const studentData = classes.flatMap(className => {
      return Array.from({ length: studentsPerClass }, (_, i) => {
        const name = studentNames[className as keyof typeof studentNames][i]
        const email = name.toLowerCase().replace(/\s+/g, '.') + '@university.edu'
        return {
          name,
          email,
          bio: studentBios[className as keyof typeof studentBios][i],
          role: 'STUDENT' as const,
          class: className,
          image: `https://api.dicebear.com/7.x/rings/svg?seed=${name.replace(/\s+/g, '')}&backgroundColor=42ff00&textureChance=100`
        }
      })
    })

    // Add all users to the store and store the created users
    const teachers = teacherData.map(data => this.createUser(data))
    const students = studentData.map(data => this.createUser(data))

    // Generate ratings between students
    students.forEach(student => {
      // Each student rates 5 other random students
      const otherStudents = students.filter(s => s.id !== student.id)
      const randomStudents = otherStudents
        .sort(() => Math.random() - 0.5)
        .slice(0, 5)
      
      randomStudents.forEach(targetStudent => {
        // Add bias for certain students to receive 5-star ratings
        const isTopStudent = Math.random() < 0.05 // 5% chance of being a top student
        if (isTopStudent) {
          const rating = generateRandomRating(student.id, targetStudent.id)
          this.createRating({
            giverId: student.id,
            receiverId: targetStudent.id,
            stars: 5,
            comment: rating.comments[5][Math.floor(Math.random() * rating.comments[5].length)]
          })
        } else {
          this.createRating(generateRandomRating(student.id, targetStudent.id))
        }
      })
    })

    // Teachers rate their students and other students
    teachers.forEach(teacher => {
      // Rate students in their own class
      const classStudents = students.filter(s => s.class === teacher.class)
      classStudents.forEach(student => {
        // Add bias for certain students to receive 5-star ratings
        const isTopStudent = Math.random() < 0.05 // 5% chance of being a top student
        if (isTopStudent) {
          const rating = generateRandomRating(teacher.id, student.id)
          this.createRating({
            giverId: teacher.id,
            receiverId: student.id,
            stars: 5,
            comment: rating.comments[5][Math.floor(Math.random() * rating.comments[5].length)]
          })
        } else {
          this.createRating(generateRandomRating(teacher.id, student.id))
        }
      })

      // Rate students from other classes (2-3 students per other class)
      const otherClasses = classes.filter(c => c !== teacher.class)
      otherClasses.forEach(className => {
        const otherClassStudents = students.filter(s => s.class === className)
        const randomStudents = otherClassStudents
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.floor(Math.random() * 2) + 2) // 2-3 students
        
        randomStudents.forEach(student => {
          // Add bias for certain students to receive 5-star ratings
          const isTopStudent = Math.random() < 0.05 // 5% chance of being a top student
          if (isTopStudent) {
            const rating = generateRandomRating(teacher.id, student.id)
            this.createRating({
              giverId: teacher.id,
              receiverId: student.id,
              stars: 5,
              comment: rating.comments[5][Math.floor(Math.random() * rating.comments[5].length)]
            })
          } else {
            this.createRating(generateRandomRating(teacher.id, student.id))
          }
        })
      })
    })
  }

  // User methods
  createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const id = Math.random().toString(36).substring(2, 15)
    const now = new Date()
    const newUser = {
      ...user,
      id,
      createdAt: now,
      updatedAt: now
    }
    this.users.set(id, newUser)
    this.emailToId.set(user.email, id)
    return newUser
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id)
  }

  getUserByEmail(email: string): User | undefined {
    const id = this.emailToId.get(email)
    return id ? this.users.get(id) : undefined
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values())
  }

  // Rating methods
  createRating(rating: {
    giverId: string;
    receiverId: string;
    stars: number;
    comment?: string | null;
    createdAt?: Date;
  }): Rating {
    const id = Math.random().toString(36).substring(2, 15)
    const now = new Date()
    const newRating = {
      ...rating,
      id,
      createdAt: rating.createdAt || now // Use provided date or current date
    }
    this.ratings.set(id, newRating)
    return newRating
  }

  getRatingsByReceiverId(receiverId: string): Rating[] {
    return Array.from(this.ratings.values()).filter(rating => rating.receiverId === receiverId)
  }

  getRatingsByGiverId(giverId: string): Rating[] {
    return Array.from(this.ratings.values()).filter(rating => rating.giverId === giverId)
  }

  getAllRatings(): Rating[] {
    return Array.from(this.ratings.values())
  }

  private generateRating(receiverId: string, giverId: string): Rating {
    const receiver = Array.from(this.users.values()).find(u => u.id === receiverId)
    if (!receiver) throw new Error('Receiver not found')

    // Generate a random date within the last 6 months
    const now = new Date()
    const sixMonthsAgo = new Date(now.getTime() - (180 * 24 * 60 * 60 * 1000)) // 180 days ago
    const randomDate = new Date(sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime()))

    // 5% chance to be a top student (5 stars)
    // 5% chance to be a bad student (1 star)
    const rand = Math.random()
    if (rand < 0.05) {
      // Top student - always 5 stars
      return {
        id: crypto.randomUUID(),
        giverId,
        receiverId,
        stars: 5,
        comment: this.generateComment(5),
        createdAt: randomDate
      }
    } else if (rand < 0.10) {
      // Bad student - always 1 star
      return {
        id: crypto.randomUUID(),
        giverId,
        receiverId,
        stars: 1,
        comment: this.generateComment(1),
        createdAt: randomDate
      }
    }

    // For regular students, use this distribution:
    // 20% chance of 1 star
    // 25% chance of 2 stars
    // 20% chance of 3 stars
    // 20% chance of 4 stars
    // 10% chance of 5 stars
    const studentRand = Math.random()
    let stars: number
    if (studentRand < 0.20) stars = 1
    else if (studentRand < 0.45) stars = 2
    else if (studentRand < 0.65) stars = 3
    else if (studentRand < 0.85) stars = 4
    else stars = 5

    return {
      id: crypto.randomUUID(),
      giverId,
      receiverId,
      stars,
      comment: this.generateComment(stars),
      createdAt: randomDate
    }
  }

  private generateComment(stars: number): string {
    const comments = {
      1: [
        "Exhibits significant behavioral deviations",
        "Requires immediate behavioral correction",
        "Shows concerning non-compliance patterns",
        "Needs urgent intervention",
        "Demonstrates unacceptable conduct"
      ],
      2: [
        "Shows concerning behavioral patterns",
        "Needs behavioral adjustment",
        "Displays non-compliant tendencies",
        "Requires monitoring",
        "Shows signs of deviation"
      ],
      3: [
        "Maintains basic compliance",
        "Shows acceptable behavior",
        "Demonstrates standard conduct",
        "Meets minimum requirements",
        "Shows adequate conformity"
      ],
      4: [
        "Exhibits strong compliance",
        "Shows exemplary behavior",
        "Demonstrates excellent conduct",
        "Maintains high standards",
        "Shows commendable conformity"
      ],
      5: [
        "Exemplifies perfect compliance",
        "Shows exceptional behavior",
        "Demonstrates outstanding conduct",
        "Maintains exemplary standards",
        "Shows exceptional conformity"
      ]
    }
    return comments[stars as keyof typeof comments][Math.floor(Math.random() * comments[stars as keyof typeof comments].length)]
  }
}

// Export a singleton instance
export const store = new Store() 