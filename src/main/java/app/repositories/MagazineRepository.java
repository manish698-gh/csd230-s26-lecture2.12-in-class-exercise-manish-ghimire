package app.repositories;

import app.entities.MagazineEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MagazineRepository extends JpaRepository<MagazineEntity, Long> {
}