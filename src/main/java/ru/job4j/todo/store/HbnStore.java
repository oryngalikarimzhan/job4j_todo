package ru.job4j.todo.store;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.boot.MetadataSources;
import org.hibernate.boot.registry.StandardServiceRegistry;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import ru.job4j.todo.model.Item;
import ru.job4j.todo.model.User;

import java.util.List;
import java.util.function.Function;

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

    private <T> T tx(final Function<Session, T> command) {
        final Session session = sf.openSession();
        final Transaction tx = session.beginTransaction();
        try {
            T rsl = command.apply(session);
            tx.commit();
            return rsl;
        } catch (final Exception e) {
            session.getTransaction().rollback();
            throw e;
        } finally {
            session.close();
        }
    }

    @Override
    public Item addItem(Item item) {
        return this.tx(session -> {
            session.save(item);
            return item;
        });
    }

    @Override
    public boolean updateItem(Item item) {
        return this.tx(session -> {
            session.update(item);
            return true;
        });
    }

    @Override
    public boolean delete(int id) {
        Item item = findById(id);
        return this.tx(session -> {
            session.delete(item);
            return true;
        });
    }

    @Override
    public List<Item> findAll(int userId) {
        return this.tx(
                session -> session.createQuery(
                        "from ru.job4j.todo.model.Item where user_id = :id order by id asc")
                        .setParameter("id", userId)
                        .list()
        );
    }

    @Override
    public Item findById(int id) {
        return this.tx(session -> session.get(Item.class, id));
    }

    @Override
    public User findUserByEmail(String email) {
        return (User) this.tx(session -> session.createQuery("from ru.job4j.todo.model.User where email=:email")
                    .setParameter("email", email).uniqueResult()
        );
    }

    @Override
    public User saveUser(User user) {
        return this.tx(session -> {
            session.save(user);
            return user;
        });
    }

    @Override
    public void close() throws Exception {
        StandardServiceRegistryBuilder.destroy(registry);
    }
}