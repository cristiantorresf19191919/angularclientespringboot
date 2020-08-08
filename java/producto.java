package com.opttimusdev.springbootapirest.models.entity;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
@Entity
@Table(name = "productos")
public class Producto implements Serializable {
    public Producto(){}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column()
    private String nombre;
    @Column()
    private Double precio;
    @Column(name = "created_at")
    @Temporal(TemporalType.DATE)
    private Date createdAt;

    @PrePersist
    public void prePersist(){
        this.createdAt = new Date();
    }




    //GETTER AND SETTERS

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Double getPrecio() {
        return precio;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
    //fin getters and setters
    private static final long serialVersionUID = 1L;

}
