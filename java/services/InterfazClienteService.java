package com.opttimusdev.springbootapirest.services;

import com.opttimusdev.springbootapirest.models.entity.Cliente;
import com.opttimusdev.springbootapirest.models.entity.Factura;
import com.opttimusdev.springbootapirest.models.entity.Region;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
public interface IClienteService {

    public List<Cliente> findAll();
    public Page<Cliente> findAll(Pageable pageable);
    public Cliente save(Cliente cliente);
    public void delete(Long id);
    public Cliente findById(Long id);
    public List<Region> findAllRegiones();





}
