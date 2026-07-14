package app.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

import java.util.Objects;

@Entity
@DiscriminatorValue("DISCMAG")
public class DiscMagEntity extends MagazineEntity {
    private boolean hasDisc;

    public DiscMagEntity() {
        super();
    }


    public DiscMagEntity(String title, Double price, Integer copies, Integer issueNumber, boolean hasDisc) {
        super(title, price, copies, issueNumber);  // ← Match MagazineEntity constructor
        this.hasDisc = hasDisc;
    }

    // Getters and Setters
    public boolean isHasDisc() { return hasDisc; }
    public void setHasDisc(boolean hasDisc) { this.hasDisc = hasDisc; }

    @Override
    public void sellItem() {
        System.out.println("Selling Disc Magazine: " + getTitle() + " (Has Disc: " + hasDisc + ")");
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        DiscMagEntity that = (DiscMagEntity) o;
        return hasDisc == that.hasDisc;
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), hasDisc);
    }

    @Override
    public String toString() {
        return "DiscMagEntity{" +
                "hasDisc=" + hasDisc +
                "} " + super.toString();
    }
}