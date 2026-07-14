package app;

import app.config.RsaKeyProperties;
import com.github.javafaker.Faker;
import app.entities.*;
import app.repositories.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
@EnableConfigurationProperties(RsaKeyProperties.class)
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CommandLineRunner demo(
            BookRepository bookRepository,
            UserRepository userRepository,
            TicketEntityRepository ticketRepository,
            MagazineRepository magazineRepository) {  // ← ADDED!
        return (args) -> {
            Faker faker = new Faker();

            // 1. Seed Books
            if (bookRepository.count() == 0) {
                for (int i = 0; i < 5; i++) {
                    bookRepository.save(new BookEntity(
                            faker.book().author(),
                            faker.book().title(),
                            faker.number().randomDouble(2, 10, 50),
                            faker.number().numberBetween(5, 20)
                    ));
                }
                System.out.println(">> Seeded 5 Books");
            }

            // 2. Seed Tickets
            if (ticketRepository.count() == 0) {
                ticketRepository.save(new TicketEntity("Concert Ticket", 99.99));
                ticketRepository.save(new TicketEntity("Movie Ticket", 12.50));
                System.out.println(">> Seeded 2 Tickets");
            }

            // 3. Seed Magazines
            if (magazineRepository.count() == 0) {
                magazineRepository.save(new MagazineEntity("Tech Today", 9.99, 5, 42));
                magazineRepository.save(new MagazineEntity("Science Weekly", 14.99, 3, 15));
                magazineRepository.save(new MagazineEntity("Fashion Monthly", 12.99, 8, 7));
                System.out.println(">> Seeded 3 Magazines");
            }

            // 4. Seed Default Users
            if (userRepository.count() == 0) {
                userRepository.save(new UserEntity("admin", passwordEncoder().encode("admin"), "ADMIN"));
                userRepository.save(new UserEntity("user", passwordEncoder().encode("user"), "USER"));
                System.out.println(">> Seeded Users: admin/admin, user/user");
            }
        };
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
            }
        };
    }
}