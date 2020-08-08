package com.opttimusdev.springbootapirest.models.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.graalvm.compiler.lir.LIRInstruction;
import org.hibernate.exception.DataException;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "facturas")
public class Factura implements Serializable {
    //Constructor
    public Factura(List<ItemFactura> items) {
        this.items = new ArrayList<>();
    }
    @JsonIgnoreProperties({"facturas","hibernateLazyInitializer","handler"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "factura_id")
    private List<ItemFactura> items;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column()
    private String descripcion;
    @Column()
    private String observacion;
    @Column(name = "create_at")
    @Temporal(TemporalType.DATE)
    private Date createdAt;
    public Date getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }




    @PrePersist
    public void prePersist(){
        this.createdAt = new Date();
    }

    public Double getTotal(){
        Double total = 0.00;
        for (ItemFactura item: items){
            total += item.getImporte();

        }
        return total;
    }

    //GETTERS AND SETTERS
    public Cliente getCliente() {
        return cliente;
    }
    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getDescripcion() {
        return descripcion;
    }
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getObservacion() {
        return observacion;
    }
    public void setObservacion(String observacion) {
        this.observacion = observacion;
    }

    public List<ItemFactura> getItems() {
        return items;
    }
    public void setItems(List<ItemFactura> items) {
        this.items = items;
    }

    private static final long serialVersionUID = 1L;
}
