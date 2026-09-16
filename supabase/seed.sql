-- Safe seed for the first SkillQuarry Java learning course.
-- Run this manually in the Supabase SQL Editor.
-- This script inserts the first published Java course, Module 1, all topics,
-- topic content, and practice problems without deleting existing records.

INSERT INTO public.courses (
  id,
  title,
  slug,
  description,
  level,
  published,
  order_index,
  created_at,
  updated_at
) VALUES (
  '11111111-1111-4111-8111-111111111111',
  'Java Programming',
  'java-programming',
  'A structured beginner-friendly path to learning Java from fundamentals through object-oriented programming and practical problem solving.',
  'Beginner',
  true,
  1,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.modules (
  id,
  course_id,
  title,
  slug,
  description,
  order_index,
  published,
  created_at,
  updated_at
) VALUES (
  '22222222-2222-4222-8222-222222222222',
  '11111111-1111-4111-8111-111111111111',
  'Getting Started with Java',
  'getting-started-with-java',
  'Learn the foundations of Java, how it works, and how to write your first program.',
  1,
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.topics (
  id,
  module_id,
  title,
  slug,
  description,
  order_index,
  published,
  created_at,
  updated_at
) VALUES
  (
    '33333333-3333-4333-8333-333333333333',
    '22222222-2222-4222-8222-222222222222',
    'What is Java?',
    'what-is-java',
    'Understand what Java is, where it is used, and why it remains a major language for software development.',
    1,
    true,
    NOW(),
    NOW()
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    '22222222-2222-4222-8222-222222222222',
    'Why Learn Java?',
    'why-learn-java',
    'Discover the reasons Java is useful for building reliable, portable, and long-lived applications.',
    2,
    true,
    NOW(),
    NOW()
  ),
  (
    '55555555-5555-4555-8555-555555555555',
    '22222222-2222-4222-8222-222222222222',
    'Java Features',
    'java-features',
    'See the main features that make Java popular, especially for learning and enterprise software.',
    3,
    true,
    NOW(),
    NOW()
  ),
  (
    '66666666-6666-4666-8666-666666666666',
    '22222222-2222-4222-8222-222222222222',
    'JDK, JRE and JVM',
    'jdk-jre-jvm',
    'Learn the three core Java runtime and development concepts that power Java programs.',
    4,
    true,
    NOW(),
    NOW()
  ),
  (
    '77777777-7777-4777-8777-777777777777',
    '22222222-2222-4222-8222-222222222222',
    'Installing Java',
    'installing-java',
    'Set up Java on your machine so you can compile and run Java programs locally.',
    5,
    true,
    NOW(),
    NOW()
  ),
  (
    '88888888-8888-4888-8888-888888888888',
    '22222222-2222-4222-8222-222222222222',
    'Setting Up an IDE',
    'setting-up-an-ide',
    'Choose a development environment that makes Java coding easier and more productive.',
    6,
    true,
    NOW(),
    NOW()
  ),
  (
    '99999999-9999-4999-8999-999999999999',
    '22222222-2222-4222-8222-222222222222',
    'Your First Java Program',
    'first-java-program',
    'Write and run a basic Java program to confirm your setup is working correctly.',
    7,
    true,
    NOW(),
    NOW()
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '22222222-2222-4222-8222-222222222222',
    'How a Java Program Works',
    'how-java-program-works',
    'Understand the flow from source code to runtime behavior in a Java application.',
    8,
    true,
    NOW(),
    NOW()
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    '22222222-2222-4222-8222-222222222222',
    'Compilation and Execution',
    'compilation-and-execution',
    'See how Java source files are compiled and then run by the Java Virtual Machine.',
    9,
    true,
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.topic_content (
  id,
  topic_id,
  definition,
  explanation,
  key_points,
  why_it_matters,
  common_mistakes,
  example_code,
  compiler_url,
  created_at,
  updated_at
) VALUES
  (
    '11111111-0000-4000-8000-000000000001',
    '33333333-3333-4333-8333-333333333333',
    'Java is a high-level, class-based programming language designed to be portable, reliable, and easy to read.',
    'Java was created to help developers write software that could run across different machines with minimal changes. It became popular because the same Java program can often run on many operating systems after compilation. This makes Java useful for desktop software, backend systems, Android apps, and enterprise services.',
    ARRAY['Java is object-oriented', 'Java is platform-independent', 'Java code is compiled to bytecode', 'Java is used in many industries'],
    'Java powers large systems and applications that need to stay stable and portable over time. Learning Java helps you understand classic object-oriented programming and prepares you for backend and enterprise development work.',
    ARRAY['Thinking Java is only for big enterprises', 'Confusing Java with JavaScript', 'Assuming every program is written in one file'],
    'public class HelloWorld {\n  public static void main(String[] args) {\n    System.out.println("Hello, Java!");\n  }\n}',
    NULL,
    NOW(),
    NOW()
  ),
  (
    '11111111-0000-4000-8000-000000000002',
    '44444444-4444-4444-8444-444444444444',
    'Learning Java helps you build a strong base in programming, object-oriented thinking, and software design.',
    'Java is a great language to learn because it forces you to understand structure, types, and clear organization. Once you understand Java fundamentals, it becomes easier to pick up other languages and frameworks. It also gives you exposure to patterns used widely in modern software engineering.',
    ARRAY['Java is beginner-friendly with a clear structure', 'It teaches object-oriented thinking', 'It is used in enterprise and backend systems', 'It helps prepare for other languages'],
    'Understanding Java makes it easier to reason about real-world software systems, especially if you want to build apps, tools, or backend services that need reliability and maintainability.',
    ARRAY['Skipping the basics because the language looks formal', 'Learning syntax without understanding objects', 'Not practicing consistently'],
    'class Main {\n  public static void main(String[] args) {\n    System.out.println("Java helps you build solid foundations.");\n  }\n}',
    NULL,
    NOW(),
    NOW()
  ),
  (
    '11111111-0000-4000-8000-000000000003',
    '55555555-5555-4555-8555-555555555555',
    'Java features include object-oriented design, portability, safety, and a large standard library.',
    'Java includes many features that make it practical for large projects. It focuses on strong typing, reusable classes, and tools that help you write maintainable code. The language also has a large ecosystem and an active developer community.',
    ARRAY['Object-oriented programming', 'Platform independence', 'Strong typing', 'Large standard library'],
    'The more you understand Java features, the more confident you become with writing structured, readable, and maintainable software. These ideas apply beyond Java itself.',
    ARRAY['Mixing up Java features with JavaScript features', 'Forgetting that Java is strongly typed', 'Assuming a feature is automatic without understanding it'],
    'class FeaturesDemo {\n  public static void main(String[] args) {\n    int count = 5;\n    System.out.println("Java supports strong typing: " + count);\n  }\n}',
    NULL,
    NOW(),
    NOW()
  ),
  (
    '11111111-0000-4000-8000-000000000004',
    '66666666-6666-4666-8666-666666666666',
    'The JDK contains development tools, the JRE contains runtime support, and the JVM executes Java bytecode.',
    'The Java Development Kit (JDK) includes the compiler and tools used to create Java programs. The Java Runtime Environment (JRE) provides the runtime environment needed to run Java programs. The Java Virtual Machine (JVM) executes the compiled bytecode and handles memory and processing details.',
    ARRAY['JDK is for developers', 'JRE is for running programs', 'JVM runs Java bytecode', 'All three work together'],
    'These concepts explain why Java can be portable and why it is important to install the correct Java version in your environment.',
    ARRAY['Thinking JDK and JRE are the same thing', 'Ignoring the role of the JVM', 'Installing Java without verifying the version'],
    'public class JdkExample {\n  public static void main(String[] args) {\n    System.out.println("The JVM executes compiled Java code.");\n  }\n}',
    NULL,
    NOW(),
    NOW()
  ),
  (
    '11111111-0000-4000-8000-000000000005',
    '77777777-7777-4777-8777-777777777777',
    'Installing Java means setting up the JDK so your system can compile and run Java code.',
    'To write Java programs, you need the JDK installed and configured correctly on your machine. After installation, you can use the Java compiler and the Java runtime from the terminal. This is the first major step toward building your own programs.',
    ARRAY['Download the JDK version meant for your operating system', 'Verify that java and javac are available', 'Use the terminal to check the version'],
    'If Java is not installed or configured correctly, you cannot compile code. This blocks every future Java task, so installation is a foundational step.',
    ARRAY['Installing only the JRE when you need javac', 'Forgetting to add Java to PATH', 'Not checking the version'],
    'public class InstallCheck {\n  public static void main(String[] args) {\n    System.out.println("Java is installed and ready.");\n  }\n}',
    NULL,
    NOW(),
    NOW()
  ),
  (
    '11111111-0000-4000-8000-000000000006',
    '88888888-8888-4888-8888-888888888888',
    'An IDE makes Java development easier by providing code editing, autocomplete, and debugging support.',
    'An Integrated Development Environment (IDE) helps you write and organize Java code more efficiently. Popular IDEs such as IntelliJ IDEA, Eclipse, and VS Code make it easier to manage projects, run files, and debug errors.',
    ARRAY['IDEs improve productivity', 'They help catch errors early', 'They organize project files cleanly', 'Good IDEs support compilation and debugging'],
    'A good setup reduces friction while learning. A beginner-friendly IDE makes it easier to stay focused on understanding the language instead of frustrating setup details.',
    ARRAY['Using a plain text editor without structure', 'Ignoring indentation and formatting', 'Running code without understanding the project setup'],
    'public class IdeDemo {\n  public static void main(String[] args) {\n    System.out.println("Use an IDE to stay productive.");\n  }\n}',
    NULL,
    NOW(),
    NOW()
  ),
  (
    '11111111-0000-4000-8000-000000000007',
    '99999999-9999-4999-8999-999999999999',
    'A Java program usually starts with a class containing a main method that runs when the program starts.',
    'Your first Java program is usually a small class with a main method. The main method is the entry point where the Java runtime begins executing your code. The output is printed to the console with System.out.println().',
    ARRAY['Every Java program has a class', 'The main method starts execution', 'System.out.println prints to the console'],
    'The first program is a milestone because it confirms your environment works and introduces the basic structure every Java application uses.',
    ARRAY['Forgetting the main method', 'Missing the closing brace', 'Using incorrect casing such as system.out.println'],
    'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, Java!");\n  }\n}',
    'https://www.jdoodle.com/online-java-compiler/',
    NOW(),
    NOW()
  ),
  (
    '11111111-0000-4000-8000-000000000008',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'A Java program is compiled into bytecode, and the JVM executes that bytecode to produce the program''s behavior.',
    'When you write Java source code, the compiler checks for syntax issues and translates the code into bytecode. The JVM then loads and executes that bytecode. This process is part of why Java is portable and why a single Java program can run on many platforms.',
    ARRAY['Source code is written by the developer', 'Compiler turns code into bytecode', 'JVM executes the bytecode', 'This process makes Java portable'],
    'Understanding how Java works helps you debug issues more intelligently and appreciate why the language is structured the way it is.',
    ARRAY['Assuming Java runs directly from source code', 'Ignoring the compile step', 'Mistaking Java bytecode for source code'],
    'public class ProgramFlow {\n  public static void main(String[] args) {\n    System.out.println("Java source becomes bytecode and then runs.");\n  }\n}',
    NULL,
    NOW(),
    NOW()
  ),
  (
    '11111111-0000-4000-8000-000000000009',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'Compilation and execution are the steps that turn your Java code into a running program.',
    'Java source files end in .java. The compiler converts them into .class files containing bytecode. Then the JVM runs those class files, executing the program''s instructions. This separation of compilation and execution is one of Java''s core strengths.',
    ARRAY['Compile with javac', 'Run with java', 'Bytecode is platform-independent', 'The JVM handles execution'],
    'This concept is important because it explains how Java handles portability and why tools like javac and java are central to the language.',
    ARRAY['Forgetting to compile before running', 'Running the wrong file', 'Thinking the JVM reads the .java file directly'],
    'public class CompileRun {\n  public static void main(String[] args) {\n    System.out.println("Compile, then run.");\n  }\n}',
    'https://www.jdoodle.com/online-java-compiler/',
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.practice_problems (
  id,
  topic_id,
  question,
  hint,
  solution,
  difficulty,
  order_index,
  created_at,
  updated_at
) VALUES
  (
    '21111111-1111-4111-8111-111111111111',
    '33333333-3333-4333-8333-333333333333',
    'Why is Java considered portable?',
    'Think about what Java code is converted into before runtime.',
    'Java is considered portable because it is compiled into bytecode and then run by the JVM, which can execute that bytecode on different operating systems.',
    'easy',
    1,
    NOW(),
    NOW()
  ),
  (
    '21111111-1111-4111-8111-111111111112',
    '44444444-4444-4444-8444-444444444444',
    'Name one reason Java is a good language to learn for beginners.',
    'Consider structure, clarity, and how it teaches good software habits.',
    'One reason is that Java teaches strong programming structure and object-oriented thinking in a clear and disciplined way.',
    'easy',
    1,
    NOW(),
    NOW()
  ),
  (
    '21111111-1111-4111-8111-111111111113',
    '55555555-5555-4555-8555-555555555555',
    'What does Java''s strong typing help you do?',
    'Think about catching mistakes earlier in development.',
    'Strong typing helps catch type-related errors earlier and makes code more predictable and easier to maintain.',
    'easy',
    1,
    NOW(),
    NOW()
  ),
  (
    '21111111-1111-4111-8111-111111111114',
    '66666666-6666-4666-8666-666666666666',
    'What is the difference between the JDK and the JRE?',
    'Remember which one is for developing code and which one is for running it.',
    'The JDK includes the tools used to develop and compile Java programs, while the JRE provides the runtime environment needed to run them.',
    'medium',
    1,
    NOW(),
    NOW()
  ),
  (
    '21111111-1111-4111-8111-111111111115',
    '77777777-7777-4777-8777-777777777777',
    'Why do you need the JDK to write Java programs?',
    'Think about the compiler and the tools developers use.',
    'You need the JDK because it includes the Java compiler and the development tools required to write and compile Java code.',
    'easy',
    1,
    NOW(),
    NOW()
  ),
  (
    '21111111-1111-4111-8111-111111111116',
    '88888888-8888-4888-8888-888888888888',
    'What is an IDE, and why is it helpful?',
    'Think about a tool that combines editing, project structure, and debugging support.',
    'An IDE is an integrated development environment that helps developers write, organize, run, and debug code more efficiently.',
    'easy',
    1,
    NOW(),
    NOW()
  ),
  (
    '21111111-1111-4111-8111-111111111117',
    '99999999-9999-4999-8999-999999999999',
    'What is the purpose of the main method in Java?',
    'Think about the starting point for the program.',
    'The main method is the entry point of a Java application. The Java runtime starts executing code from this method.',
    'easy',
    1,
    NOW(),
    NOW()
  ),
  (
    '21111111-1111-4111-8111-111111111118',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'What role does the JVM play in Java execution?',
    'Think about the place where Java bytecode is executed.',
    'The JVM executes Java bytecode and handles runtime operations such as memory management and execution control.',
    'medium',
    1,
    NOW(),
    NOW()
  ),
  (
    '21111111-1111-4111-8111-111111111119',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'What happens between writing Java source code and running the program?',
    'Think about the compilation step and then the runtime step.',
    'Java source code is compiled into bytecode, and then the JVM executes that bytecode to run the program.',
    'medium',
    1,
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO NOTHING;
