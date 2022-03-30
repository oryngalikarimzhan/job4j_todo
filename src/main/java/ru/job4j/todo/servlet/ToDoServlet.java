package ru.job4j.todo.servlet;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import ru.job4j.todo.model.Category;
import ru.job4j.todo.model.Item;
import ru.job4j.todo.model.User;
import ru.job4j.todo.store.HbnStore;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ToDoServlet extends HttpServlet {

    private static final Gson GSON = new GsonBuilder().create();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json; charset=utf-8");
        OutputStream output = resp.getOutputStream();
        User user = (User) req.getSession().getAttribute("user");
        List<Item> items = HbnStore.instOf().findAll(user.getId());
        String json = GSON.toJson(items);
        output.write(json.getBytes(StandardCharsets.UTF_8));
        output.flush();
        output.close();
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        String description = req.getParameter("description");
        TypeToken<Map<String, String[]>> t = new TypeToken<>() { };
        Map<String, String[]> categoriesMap = GSON.fromJson(req.getParameter("categoriesId"), t.getType());
        List<Category> categories = new ArrayList<>();
        for (String strId : categoriesMap.get("checkedCategoriesId")) {
            categories.add(HbnStore.instOf().findCategoryById(Integer.parseInt(strId)));
        }
        Item itemInitial = Item.of(description, (User) req.getSession().getAttribute("user"), categories);
        Item itemFounded = HbnStore.instOf().addItem(itemInitial);
        String result = GSON.toJson(itemFounded);
        resp.setContentType("text/plain");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter writer = new PrintWriter(resp.getOutputStream());
        writer.println(result);
        writer.flush();
        writer.close();
    }
}
