package com.apsitsafe.repository;

import com.apsitsafe.model.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> findByType(String type);

    List<Item> findByStatus(String status);

    List<Item> findByCategory(String category);

    List<Item> findByLocation(String location);

    List<Item> findByReportedById(Long userId);

    @Query("SELECT i FROM Item i WHERE " +
           "(:type IS NULL OR i.type = :type) AND " +
           "(:category IS NULL OR i.category = :category) AND " +
           "(:location IS NULL OR i.location = :location) AND " +
           "(:search IS NULL OR LOWER(i.itemName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(i.description) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(i.location) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY i.createdAt DESC")
    List<Item> findWithFilters(@Param("type") String type,
                               @Param("category") String category,
                               @Param("location") String location,
                               @Param("search") String search);

    @Query("SELECT i FROM Item i WHERE UPPER(i.status) != 'RESOLVED' AND " +
           "(:type IS NULL OR i.type = :type) AND " +
           "(:category IS NULL OR i.category = :category) AND " +
           "(:location IS NULL OR i.location = :location) AND " +
           "(:search IS NULL OR LOWER(i.itemName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(i.description) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(i.location) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Item> findWithFiltersPaged(@Param("type") String type,
                                    @Param("category") String category,
                                    @Param("location") String location,
                                    @Param("search") String search,
                                    Pageable pageable);

    long countByType(String type);

    long countByStatus(String status);

    @Query("SELECT i.category, COUNT(i) FROM Item i GROUP BY i.category")
    List<Object[]> countByCategory();

    @Query("SELECT i.location, COUNT(i) FROM Item i GROUP BY i.location ORDER BY COUNT(i) DESC")
    List<Object[]> countByLocation();
}
