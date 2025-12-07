using System;
using System.Collections.Generic;
using CoreData.Models;
using Microsoft.EntityFrameworkCore;

namespace CoreData.Contexts;

public partial class React_ShopContext : DbContext
{
    public React_ShopContext()
    {
    }

    public React_ShopContext(DbContextOptions<React_ShopContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Brand> Brands { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql("Name=Default");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Brand>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Brand_pkey");

            entity.ToTable("Brand");

            entity.Property(e => e.Id)
                .HasDefaultValueSql("gen_random_uuid()")
                .HasColumnName("id");
            entity.Property(e => e.CreateDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("create_date");
            entity.Property(e => e.Image)
                .HasColumnType("character varying")
                .HasColumnName("image");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.Title)
                .HasColumnType("character varying")
                .HasColumnName("title");
            entity.Property(e => e.UpdateDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("update_date");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Product_pkey");

            entity.ToTable("Product");

            entity.Property(e => e.Id)
                .HasDefaultValueSql("gen_random_uuid()")
                .HasColumnName("id");
            entity.Property(e => e.Bonus).HasColumnName("bonus");
            entity.Property(e => e.BrandId).HasColumnName("brand_id");
            entity.Property(e => e.CreateDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("create_date");
            entity.Property(e => e.Description)
                .HasColumnType("character varying")
                .HasColumnName("description");
            entity.Property(e => e.Image)
                .HasColumnType("character varying")
                .HasColumnName("image");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.Name)
                .HasColumnType("character varying")
                .HasColumnName("name");
            entity.Property(e => e.Price).HasColumnName("price");
            entity.Property(e => e.UpdateDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("update_date");

            entity.HasOne(d => d.Brand).WithMany(p => p.Products)
                .HasForeignKey(d => d.BrandId)
                .HasConstraintName("fk_product_brand");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("User_pkey");

            entity.ToTable("User");

            entity.Property(e => e.Id)
                .HasDefaultValueSql("gen_random_uuid()")
                .HasColumnName("id");
            entity.Property(e => e.Adress)
                .HasColumnType("character varying")
                .HasColumnName("adress");
            entity.Property(e => e.CreateDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("create_date");
            entity.Property(e => e.Email)
                .HasColumnType("character varying")
                .HasColumnName("email");
            entity.Property(e => e.Fio)
                .HasColumnType("character varying")
                .HasColumnName("fio");
            entity.Property(e => e.Image)
                .HasColumnType("character varying")
                .HasColumnName("image");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.Phone)
                .HasColumnType("character varying")
                .HasColumnName("phone");
            entity.Property(e => e.Score)
                .HasDefaultValue(0L)
                .HasColumnName("score");
            entity.Property(e => e.TelegramId)
                .HasDefaultValue(0L)
                .HasColumnName("telegram_id");
            entity.Property(e => e.UpdateDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("update_date");
            entity.Property(e => e.Username)
                .HasColumnType("character varying")
                .HasColumnName("username");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
