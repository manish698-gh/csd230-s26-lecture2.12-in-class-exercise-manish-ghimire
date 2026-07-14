package app.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

import java.util.Objects;

@Entity
@DiscriminatorValue("MAGAZINE")
public class MagazineEntity extends PublicationEntity {

    private Integer issueNumber;

    public MagazineEntity() {
        super();
    }


    public MagazineEntity(String title, Double price, Integer copies, Integer issueNumber) {
        super(title, price, copies);
        this.issueNumber = issueNumber;
    }

    public Integer getIssueNumber() {
        return issueNumber;
    }

    public void setIssueNumber(Integer issueNumber) {
        this.issueNumber = issueNumber;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        MagazineEntity that = (MagazineEntity) o;
        return Objects.equals(issueNumber, that.issueNumber);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), issueNumber);
    }

    @Override
    public String toString() {
        return "MagazineEntity{" +
                "issueNumber=" + issueNumber +
                "} " + super.toString();
    }

    @Override
    public void sellItem() {
        System.out.println("Selling Magazine: " + getTitle());
    }
}