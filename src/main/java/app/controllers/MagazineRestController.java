package app.controllers;

import app.entities.MagazineEntity;
import app.repositories.MagazineRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rest/magazines")
@CrossOrigin(origins = "*")
public class MagazineRestController {

    private final MagazineRepository repository;

    public MagazineRestController(MagazineRepository repository) {
        this.repository = repository;
    }

    // GET all magazines
    @GetMapping
    public List<MagazineEntity> getAllMagazines() {
        return repository.findAll();
    }

    // GET one magazine by ID
    @GetMapping("/{id}")
    public MagazineEntity getMagazineById(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Magazine not found with id: " + id));
    }

    // POST - Create new magazine
    @PostMapping
    public MagazineEntity createMagazine(@RequestBody MagazineEntity newMagazine) {
        return repository.save(newMagazine);
    }

    // PUT - Update magazine
    @PutMapping("/{id}")
    public MagazineEntity updateMagazine(@RequestBody MagazineEntity newMagazine, @PathVariable Long id) {
        return repository.findById(id)
                .map(magazine -> {
                    magazine.setTitle(newMagazine.getTitle());
                    magazine.setPrice(newMagazine.getPrice());
                    magazine.setCopies(newMagazine.getCopies());
                    magazine.setIssueNumber(newMagazine.getIssueNumber());
                    return repository.save(magazine);
                })
                .orElseGet(() -> {
                    newMagazine.setId(id);
                    return repository.save(newMagazine);
                });
    }

    // DELETE magazine
    @DeleteMapping("/{id}")
    public void deleteMagazine(@PathVariable Long id) {
        repository.deleteById(id);
    }
}