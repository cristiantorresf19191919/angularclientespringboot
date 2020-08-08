package com.opttimusdev.springbootapirest.dao;
import com.opttimusdev.springbootapirest.models.entity.Cliente;
import com.opttimusdev.springbootapirest.models.entity.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

//    jpa provee paginar y ordenamiento
public interface    IClienteDao extends JpaRepository<Cliente, Long> {
    @Query("from Region")
    public List<Region> findAllRegiones();
}
