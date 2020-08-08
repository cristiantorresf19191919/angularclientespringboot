package com.opttimusdev.springbootapirest.models.entity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "clientes")
public class Cliente implements Serializable {

    public Cliente(){};
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty(message = "no puede estar vacio")
    @Size(min = 4, max = 30, message = "el tamaño tiene que estar entre 4 y 12")
    @Column(nullable=false)
    private String  nombre;

    @NotEmpty(message = "no puede estar vacio")
    private String apellido;

    @NotEmpty(message = "no puede estar vacio")
    @Email(message = "el correo no tiene un formato valido")
    @Column(nullable=false, unique = true)
    private String email;

    @NotNull(message = "La fecha no puede estar vacia")
    @Column(name = "create_at")
    @Temporal(TemporalType.DATE)
    private Date createdAt;

//    asigna la fecha actual de forma automatica
//    @PrePersist
//    public void prePersist(){
//        createdAt = new Date();
//    }
    private String foto;

    //cada vez que invoquemos el atributo region
    //get region se carga
    // relacion muchos a uno
    // si no se pone joincolumn funciona exactamente
    //igual
    //omitir atributos que se generan en el json por el lazy
    @NotNull(message="la region no puede estar vacia")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private Region region;
    //cascadeType.ALL al eliminar cliente se eliminan todas las facturas hijas
    //SI GUARDAMOS un cliente con facturas, primero guarda el cliente luego inserta las facturas que son las hijas
    // integridad referencial oncascade
    @JsonIgnoreProperties({"cliente","hibernateLazyInitializer","handler"})
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "cliente", cascade = CascadeType.ALL)
    private List<Factura> facturas;





    //getters and setters
    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    public String getApellido() {
        return apellido;
    }
    public void setApellido(String apellido) {
        this.apellido = apellido;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public Date getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }




    public List<Factura> getFacturas() {
        return facturas;
    }

    public void setFacturas(List<Factura> facturas) {
        this.facturas = facturas;
    }

    public Cliente(List<Factura> facturas) {
        this.facturas = new ArrayList<>();
    }

    public Region getRegion() {
        return region;
    }
    public void setRegion(Region region) {
        this.region = region;
    }
    private static final long serialVersuionUID = 1L;
}
