package ru.job4j.todo.store;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.boot.MetadataSources;
import org.hibernate.boot.registry.StandardServiceRegistry;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import ru.job4j.todo.model.Item;
import java.util.List;

public class HbnStore implements Store, AutoCloseable {

    private final StandardServiceRegistry registry = new StandardServiceRegistryBuilder()
            .configure().build();
    private final SessionFactory sf = new MetadataSources(registry)
            .buildMetadata().buildSessionFactory();

    private static final class Lazy {
        private static final Store INST = new HbnStore();
    }

    public static Store instOf() {
        return Lazy.INST;
    }

    @Override
    public Item addItem(Item item) {
        try (Session session = sf.openSession()) {
            session.beginTransaction();
            session.save(item);
            return item;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public boolean updateItem(Item item) {
        try (Session session = sf.openSession()) {
            session.beginTransaction();
            session.update(item);
            session.flush();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public boolean delete(int id) {
        try (Session session = sf.openSession()) {
            session.beginTransaction();
            Item item = findById(id);
            session.delete(item);
            session.flush();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public List<Item> findAll() {
        try (Session session = sf.openSession()) {
            session.beginTransaction();
            List<Item> result = session.createQuery("from ru.job4j.todo.model.Item").list();
            return result;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public List<Item> findByStatus(boolean done) {
        try (Session session = sf.openSession()) {
            session.beginTransaction();
            List<Item> result = session.createQuery(
                    "from ru.job4j.todo.model.Item I where I.done = :done")
                    .setParameter("done", done)
                    .list();
            return result;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public Item findById(int id) {
        try (Session session = sf.openSession()) {
            session.beginTransaction();
            Item result = session.get(Item.class, id);
            return result;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public void close() throws Exception {
        StandardServiceRegistryBuilder.destroy(registry);
    }

    public static void main(String[] args) {
        Store store = new HbnStore();
        /*store.addItem(Item.of("aa", false));
        System.out.println(store.findById(1));
        store.findByStatus(false).forEach(System.out::println);*/
        store.findAll().forEach(System.out::println);
    }
}